import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params for Next.js 15+ compatibility
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ status: booking.status });
  } catch (error) {
    console.error("Error fetching booking status:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
