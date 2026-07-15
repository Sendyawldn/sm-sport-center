"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

export async function createBooking(courtId: string, bookingDate: string, startTimeStr: string, duration: number, paymentType: "DP_50" | "FULL_100" = "FULL_100") {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Silakan login terlebih dahulu untuk melakukan booking." };
    }

    const TIMEZONE = "Asia/Jakarta";
    
    // Server real-time in Asia/Jakarta
    const now = new Date();
    const nowZoned = toZonedTime(now, TIMEZONE);
    const currentDateStr = formatInTimeZone(now, TIMEZONE, 'yyyy-MM-dd');
    const currentTimeStr = formatInTimeZone(now, TIMEZONE, 'HH:mm');

    // Past date validation
    if (bookingDate < currentDateStr) {
      return { error: "Tanggal booking tidak boleh di masa lalu." };
    }

    // Past time validation for today
    if (bookingDate === currentDateStr && startTimeStr <= currentTimeStr) {
      return { error: "Waktu booking sudah lewat." };
    }

    // Parsing time to Date object for Prisma @db.Time (typically stored at 1970-01-01)
    const startTimeDate = new Date(`1970-01-01T${startTimeStr}:00.000Z`);
    
    // Calculate end time
    const endHour = parseInt(startTimeStr.split(":")[0]) + duration;
    const endMinute = startTimeStr.split(":")[1];
    const endTimeStr = `${endHour.toString().padStart(2, '0')}:${endMinute}`;
    const endTimeDate = new Date(`1970-01-01T${endTimeStr}:00.000Z`);

    // Parse bookingDate for @db.Date
    const bookingDateObj = new Date(`${bookingDate}T00:00:00.000Z`);

    // Fetch court to calculate price
    const court = await prisma.court.findUnique({
      where: { id: courtId },
    });

    if (!court) {
      return { error: "Lapangan tidak ditemukan." };
    }

    const totalPrice = court.pricePerHour * duration;
    const paidAmount = paymentType === "DP_50" ? totalPrice / 2 : totalPrice;

    // Transaction for anti double-booking
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Overlap Check
      const overlappingBooking = await tx.booking.findFirst({
        where: {
          courtId,
          bookingDate: bookingDateObj,
          status: { in: ['PENDING', 'PAID_DP', 'PAID'] },
          AND: [
            { startTime: { lt: endTimeDate } },
            { endTime: { gt: startTimeDate } },
          ],
        },
      });

      if (overlappingBooking) {
        throw new Error("Jadwal baru saja dipesan orang lain.");
      }

      // 2. Insert Booking
      const booking = await tx.booking.create({
        data: {
          userId: session.id,
          courtId,
          bookingDate: bookingDateObj,
          startTime: startTimeDate,
          endTime: endTimeDate,
          totalPrice,
          paymentType,
          paidAmount,
          status: 'PENDING',
        },
      });

      return booking;
    });

    return { success: true, bookingId: result.id };
  } catch (error: any) {
    if (error.message === "Jadwal baru saja dipesan orang lain.") {
      return { error: error.message };
    }
    console.error("Booking error:", error);
    return { error: "Terjadi kesalahan sistem saat memproses booking." };
  }
}
