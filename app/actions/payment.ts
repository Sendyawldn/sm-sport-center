"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function simulateQrisPayment(bookingId: string, paymentType: "DP_50" | "FULL_100") {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Sesi tidak valid. Silakan login ulang." };
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.userId !== session.id) {
      return { error: "Booking tidak ditemukan atau bukan milik Anda." };
    }

    if (booking.status !== "PENDING") {
      return { error: "Status booking tidak valid untuk pembayaran." };
    }

    const newStatus = paymentType === "DP_50" ? "PAID_DP" : "PAID";
    const amountToPay = paymentType === "DP_50" ? booking.totalPrice / 2 : booking.totalPrice;

    await prisma.$transaction(async (tx: any) => {
      // Create payment record
      await tx.payment.create({
        data: {
          bookingId,
          paymentMethod: "QRIS_SIMULATION",
          amount: amountToPay,
          paymentStatus: "PAID",
          paidAt: new Date(),
        }
      });

      // Update booking status
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: newStatus }
      });
    });

    revalidatePath("/riwayat");
    revalidatePath("/admin/dashboard");
    revalidatePath("/booking");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Payment simulation error:", error);
    return { error: "Terjadi kesalahan saat memproses pembayaran." };
  }
}

export async function konfirmasiPelunasanCash(bookingId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { error: "Akses ditolak." };
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) return { error: "Booking tidak ditemukan." };
    if (booking.status !== "PAID_DP") {
      return { error: "Booking ini bukan status PAID_DP (Belum Lunas DP)." };
    }

    const remainingAmount = booking.totalPrice - booking.paidAmount;

    await prisma.$transaction(async (tx: any) => {
      await tx.payment.create({
        data: {
          bookingId,
          paymentMethod: "CASH_ONSITE",
          amount: remainingAmount,
          paymentStatus: "PAID",
          paidAt: new Date(),
        }
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "PAID",
          paidAmount: booking.totalPrice // Update paidAmount to full
        }
      });
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/laporan");
    revalidatePath("/booking");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Confirm cash payment error:", error);
    return { error: "Gagal memproses pelunasan cash." };
  }
}

export async function verifyPayment(paymentId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return { error: "Akses ditolak." };

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true }
    });

    if (!payment) return { error: "Pembayaran tidak ditemukan." };

    await prisma.$transaction(async (tx: any) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: { paymentStatus: "PAID" }
      });
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: "PAID" }
      });
    });

    revalidatePath("/admin/pembayaran");
    revalidatePath("/admin/dashboard");
    revalidatePath("/booking");
    revalidatePath("/riwayat");
    return { success: true };
  } catch (error) {
    return { error: "Terjadi kesalahan saat memverifikasi pembayaran." };
  }
}

export async function rejectPayment(paymentId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return { error: "Akses ditolak." };

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true }
    });

    if (!payment) return { error: "Pembayaran tidak ditemukan." };

    await prisma.$transaction(async (tx: any) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: { paymentStatus: "FAILED" }
      });
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CANCELLED" }
      });
    });

    revalidatePath("/admin/pembayaran");
    revalidatePath("/admin/dashboard");
    revalidatePath("/booking");
    revalidatePath("/riwayat");
    return { success: true };
  } catch (error) {
    return { error: "Terjadi kesalahan saat menolak pembayaran." };
  }
}
