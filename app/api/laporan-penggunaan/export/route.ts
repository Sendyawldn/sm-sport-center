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
      lte: new Date(`${end}T23:59:59.999Z`)
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
        court: true,
      },
      orderBy: {
        bookingDate: "asc"
      }
    });

    // Calculate usage stats per court
    const usageStatsMap = bookings.reduce((acc: any, b: any) => {
      if (!acc[b.courtId]) {
        acc[b.courtId] = {
          courtName: b.court.name,
          type: b.court.type,
          totalBookings: 0,
          totalHours: 0,
        };
      }
      const durationHours = (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1000 * 60 * 60);
      acc[b.courtId].totalBookings += 1;
      acc[b.courtId].totalHours += durationHours;
      return acc;
    }, {});

    const usageStats: any[] = Object.values(usageStatsMap).sort((a: any, b: any) => b.totalHours - a.totalHours);

    // Generate CSV string
    const csvRows = [];
    // Header
    csvRows.push(['Nama Lapangan', 'Tipe Olahraga', 'Total Booking', 'Total Jam Terpakai'].join(','));

    // Data
    for (const stat of usageStats) {
      const row = [
        `"${stat.courtName}"`,
        stat.type,
        stat.totalBookings,
        stat.totalHours
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="Laporan_Penggunaan_SMCenter_${format(new Date(), "yyyyMMdd")}.csv"`,
      },
    });

  } catch (error) {
    console.error('Error generating CSV:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat membuat laporan.' }, { status: 500 });
  }
}
