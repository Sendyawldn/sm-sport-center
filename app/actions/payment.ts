"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function uploadPaymentProof(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Sesi tidak valid. Silakan login ulang." };
    }

    const bookingId = formData.get("bookingId") as string;
    const file = formData.get("file") as File;

    if (!bookingId || !file || file.size === 0) {
      return { error: "Booking ID dan File Bukti Transfer wajib diisi." };
    }

    // Pastikan booking valid dan milik user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.userId !== session.id) {
      return { error: "Booking tidak ditemukan atau bukan milik Anda." };
    }

    if (booking.status !== "PENDING") {
      return { error: "Status booking tidak valid untuk pembayaran." };
    }

    // Siapkan folder uploads di public
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    // Buat nama file unik
    const ext = path.extname(file.name) || ".png";
    const filename = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    // Simpan file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const proofUrl = `/uploads/${filename}`;

    // Buat Payment Record
    await prisma.$transaction(async (tx: any) => {
      await tx.payment.create({
        data: {
          bookingId,
          paymentMethod: "TRANSFER",
          amount: booking.totalPrice,
          proofUrl,
          paymentStatus: "PENDING",
        }
      });
      // Optionally, kita tidak mengubah status Booking sampai diverifikasi, 
      // tetapi untuk UX, status Booking tetap PENDING, admin melihat dari Payment
    });

    revalidatePath("/riwayat");
    return { success: true };
  } catch (error) {
    console.error("Payment upload error:", error);
    return { error: "Terjadi kesalahan saat mengunggah bukti pembayaran." };
  }
}

export async function verifyPayment(paymentId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { error: "Akses ditolak." };
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) return { error: "Payment tidak ditemukan." };

    await prisma.$transaction(async (tx: any) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          paymentStatus: "VERIFIED",
          paidAt: new Date()
        }
      });

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: "PAID" }
      });
    });

    revalidatePath("/admin/pembayaran");
    return { success: true };
  } catch (error) {
    console.error("Verify payment error:", error);
    return { error: "Gagal verifikasi pembayaran." };
  }
}

export async function rejectPayment(paymentId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { error: "Akses ditolak." };
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) return { error: "Payment tidak ditemukan." };

    await prisma.$transaction(async (tx: any) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          paymentStatus: "REJECTED"
        }
      });
      
      // Jika pembayaran ditolak, batalkan booking sekalian atau biarkan PENDING agar bisa upload ulang.
      // Di sini kita ubah Booking ke CANCELLED agar slot lapangan kembali kosong.
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CANCELLED" }
      });
    });

    revalidatePath("/admin/pembayaran");
    return { success: true };
  } catch (error) {
    console.error("Reject payment error:", error);
    return { error: "Gagal menolak pembayaran." };
  }
}
