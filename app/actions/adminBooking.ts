"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

interface OfflineBookingParams {
  courtId: string;
  bookingDate: string; // YYYY-MM-DD
  startTimeStr: string; // HH:mm
  duration: number; // in hours
  guestName: string;
  guestPhone?: string;
  paymentType: "DP_50" | "FULL_100";
  paymentMethod: "CASH" | "TRANSFER_MANUAL";
}

export async function createOfflineBooking(params: OfflineBookingParams) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { error: "Akses ditolak. Hanya admin yang bisa membuat reservasi offline." };
    }

    const {
      courtId,
      bookingDate,
      startTimeStr,
      duration,
      guestName,
      guestPhone,
      paymentType,
      paymentMethod
    } = params;

    // Parse Time and Date (Range matching for Timezone)
    const startDate = new Date(`${bookingDate}T00:00:00.000Z`);
    const endDate = new Date(`${bookingDate}T23:59:59.999Z`);
    
    const startTimeDate = new Date(`1970-01-01T${startTimeStr}:00.000Z`);
    const endHour = parseInt(startTimeStr.split(":")[0]) + duration;
    const endMinute = startTimeStr.split(":")[1];
    const endTimeStr = `${endHour.toString().padStart(2, '0')}:${endMinute}`;
    const endTimeDate = new Date(`1970-01-01T${endTimeStr}:00.000Z`);

    // Fetch court for price
    const court = await prisma.court.findUnique({ where: { id: courtId } });
    if (!court) {
      return { error: "Lapangan tidak ditemukan." };
    }

    const totalPrice = court.pricePerHour * duration;
    const paidAmount = paymentType === "DP_50" ? totalPrice / 2 : totalPrice;
    const bookingStatus = paymentType === "DP_50" ? "PAID_DP" : "PAID";

    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Check Overlap
      const overlappingBooking = await tx.booking.findFirst({
        where: {
          courtId,
          bookingDate: { gte: startDate, lte: endDate },
          status: { in: ['PENDING', 'PAID_DP', 'PAID'] },
          AND: [
            { startTime: { lt: endTimeDate } },
            { endTime: { gt: startTimeDate } },
          ],
        },
      });

      if (overlappingBooking) {
        throw new Error("Jadwal sudah terisi oleh pemesan lain.");
      }

      // 2. Handle User ID for Guest
      let targetUserId = "";
      
      if (guestPhone && guestPhone.trim() !== "") {
        let existingUser = await tx.user.findUnique({ where: { phone: guestPhone } });
        if (!existingUser) {
          const hashedPass = await bcrypt.hash("walkin123", 10);
          existingUser = await tx.user.create({
            data: {
              name: guestName || "Guest",
              phone: guestPhone,
              password: hashedPass,
            }
          });
        }
        targetUserId = existingUser.id;
      } else {
        // Fallback generic walk-in user
        let walkinUser = await tx.user.findUnique({ where: { email: "walkin@smsport.com" } });
        if (!walkinUser) {
          const hashedPass = await bcrypt.hash("walkin123", 10);
          walkinUser = await tx.user.create({
            data: {
              name: "Walk-in Guest",
              email: "walkin@smsport.com",
              password: hashedPass,
            }
          });
        }
        targetUserId = walkinUser.id;
      }

      // 3. Create Booking
      const booking = await tx.booking.create({
        data: {
          userId: targetUserId,
          courtId,
          bookingDate: startDate,
          startTime: startTimeDate,
          endTime: endTimeDate,
          totalPrice,
          paymentType,
          paidAmount,
          status: bookingStatus,
          bookingSource: "OFFLINE_CASHIER",
          guestName: guestName || "Walk-in Guest",
          guestPhone: guestPhone || null,
        },
      });

      // 4. Create Payment Record (since they pay at cashier)
      await tx.payment.create({
        data: {
          bookingId: booking.id,
          paymentMethod,
          amount: paidAmount,
          paymentStatus: "PAID",
          paidAt: new Date(),
        }
      });

      return booking;
    });

    revalidatePath("/admin/reservasi");
    revalidatePath("/admin/dashboard");
    revalidatePath("/booking"); // update customer side too
    revalidatePath("/");

    return { success: true, bookingId: result.id };
  } catch (error: any) {
    if (error.message === "Jadwal sudah terisi oleh pemesan lain.") {
      return { error: error.message };
    }
    console.error("Offline Booking error:", error);
    return { error: `Terjadi kesalahan: ${error.message || String(error)}` };
  }
}

export async function processPelunasan(bookingId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { error: "Akses ditolak." };
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return { error: "Booking tidak ditemukan." };
    if (booking.status !== "PAID_DP") return { error: "Booking tidak dalam status DP." };

    const remaining = booking.totalPrice - booking.paidAmount;

    await prisma.$transaction(async (tx: any) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "PAID",
          paidAmount: booking.totalPrice,
        }
      });

      // Update existing payment record to full amount
      await tx.payment.update({
        where: { bookingId: bookingId },
        data: {
          amount: booking.totalPrice,
          paymentStatus: "PAID",
          paidAt: new Date(),
        }
      });
    });

    revalidatePath("/admin/reservasi");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Pelunasan error:", error);
    return { error: `Terjadi kesalahan: ${error.message || String(error)}` };
  }
}
