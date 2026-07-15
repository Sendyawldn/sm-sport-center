import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');

  if (!dateStr) {
    return NextResponse.json({ error: 'Parameter date diperlukan.' }, { status: 400 });
  }

  const startDate = new Date(`${dateStr}T00:00:00.000Z`);
  const endDate = new Date(`${dateStr}T23:59:59.999Z`);

  try {
    const courts = await prisma.court.findMany({
      orderBy: [
        { type: 'desc' }, // Futsal first, then Badminton usually based on enum or string
        { name: 'asc' }
      ]
    });

    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: startDate,
          lte: endDate,
        },
        status: { in: ['PENDING', 'PAID_DP', 'PAID'] }
      },
      select: {
        id: true,
        courtId: true,
        startTime: true,
        endTime: true,
        status: true,
      }
    });

    // Format times back to HH:mm string to make it easy for frontend
    const formattedBookings = bookings.map((b: any) => ({
      ...b,
      startTime: b.startTime.toISOString().substring(11, 16),
      endTime: b.endTime.toISOString().substring(11, 16),
    }));

    return NextResponse.json({ courts, bookings: formattedBookings });
  } catch (error) {
    console.error('Error fetching courts:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal.' }, { status: 500 });
  }
}
