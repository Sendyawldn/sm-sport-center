import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format } from "date-fns";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const type = searchParams.get('type') || "ALL";

  // Build prisma where clause
  const where: any = {
    status: { in: ["PAID", "PAID_DP"] }
  };

  if (start && end) {
    where.bookingDate = {
      gte: new Date(`${start}T00:00:00.000Z`),
      lte: new Date(`${end}T00:00:00.000Z`)
    };
  }

  if (type && type !== "ALL") {
    where.court = {
      type: type
    };
  }

  try {
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: true,
        court: true,
      },
      orderBy: {
        bookingDate: "asc"
      }
    });

    // Generate CSV string
    const csvRows = [];
    // Header
    csvRows.push(['ID Booking', 'Tanggal Main', 'Jam Mulai', 'Jam Selesai', 'Lapangan', 'Tipe', 'Pelanggan', 'Email', 'Status', 'Total Harga', 'Nominal Dibayar'].join(','));

    // Data
    for (const b of bookings) {
      const row = [
        b.id,
        format(new Date(b.bookingDate), "yyyy-MM-dd"),
        b.startTime.toISOString().substring(11, 16),
        b.endTime.toISOString().substring(11, 16),
        `"${b.court.name}"`,
        b.court.type,
        `"${b.user.name}"`,
        b.user.email,
        b.status === "PAID" ? "Lunas 100%" : "DP 50%",
        b.totalPrice,
        b.paidAmount
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="Laporan_Pendapatan_SMCenter_${format(new Date(), "yyyyMMdd")}.csv"`,
      },
    });

  } catch (error) {
    console.error('Error generating CSV:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat membuat laporan.' }, { status: 500 });
  }
}
