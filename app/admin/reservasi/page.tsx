import { prisma } from "@/lib/prisma";
import CashierCalendar from "./CashierCalendar";

export const dynamic = "force-dynamic";

export default async function AdminReservasiPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const dateStr = (searchParams?.date as string) || new Date().toISOString().split("T")[0];
  
  const startDate = new Date(`${dateStr}T00:00:00.000Z`);
  const endDate = new Date(`${dateStr}T23:59:59.999Z`);

  const courts = await prisma.court.findMany({
    orderBy: [{ type: "desc" }, { name: "asc" }],
  });

  const bookings = await prisma.booking.findMany({
    where: {
      bookingDate: { gte: startDate, lte: endDate },
      status: { in: ["PENDING", "PAID_DP", "PAID"] },
    },
    include: {
      user: true,
    },
  });

  const formattedBookings = bookings.map((b) => ({
    id: b.id,
    courtId: b.courtId,
    startTime: b.startTime.toISOString().substring(11, 16),
    endTime: b.endTime.toISOString().substring(11, 16),
    status: b.status,
    bookingSource: b.bookingSource,
    guestName: b.guestName || b.user?.name || "Pelanggan",
    paymentType: b.paymentType,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Kalender Reservasi Kasir
      </h1>
      <CashierCalendar 
        courts={courts} 
        bookings={formattedBookings} 
        initialDate={dateStr} 
      />
    </div>
  );
}
