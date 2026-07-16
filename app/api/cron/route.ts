import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // No caching

export async function GET(request: Request) {
  try {
    // Optional: Protect the cron route with a secret key
    const authHeader = request.headers.get('authorization');
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: fifteenMinsAgo,
        },
      },
    });

    if (expiredBookings.length > 0) {
      const res = await prisma.booking.updateMany({
        where: {
          id: {
            in: expiredBookings.map((b) => b.id),
          },
        },
        data: {
          status: 'CANCELLED',
        },
      });

      return NextResponse.json({
        success: true,
        message: `Berhasil mengubah ${res.count} booking menjadi CANCELLED.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Tidak ada booking yang kadaluarsa.',
    });
  } catch (error) {
    console.error('Gagal menjalankan cron job auto-cancel:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
