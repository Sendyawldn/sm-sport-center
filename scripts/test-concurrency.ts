import 'dotenv/config'
import { prisma } from '../lib/prisma'
import { createBooking } from '../app/actions/booking'

async function runConcurrencyTest() {
  console.log("=== Menguji Skenerio Concurrency ===")
  
  // 1. Get first available court
  const court = await prisma.court.findFirst()
  if (!court) throw new Error("Tidak ada lapangan.")
    
  // 2. Setup mock session directly in DB or we can test by calling createBooking.
  // Wait, createBooking uses getSession() which relies on Next.js headers (cookies).
  // We can't call Next.js Server Actions that use cookies() directly from a Node script easily without a mock.
  // So instead, we will use fetch to hit an API endpoint or we mock the transaction directly to prove the DB locking works.
  
  console.log(`Menggunakan lapangan: ${court.name} (${court.id})`)
  const dateStr = "2026-12-31"
  const timeStr = "10:00"
  
  // Mock function representing the core logic inside the server action
  const attemptBooking = async (userId: string, label: string) => {
    try {
      const startTimeDate = new Date(`1970-01-01T${timeStr}:00.000Z`)
      const endTimeDate = new Date(`1970-01-01T11:00:00.000Z`)
      const bookingDateObj = new Date(`${dateStr}T00:00:00.000Z`)

      const result = await prisma.$transaction(async (tx) => {
        const overlappingBooking = await tx.booking.findFirst({
          where: {
            courtId: court.id,
            bookingDate: bookingDateObj,
            status: { in: ['PENDING', 'PAID'] },
            AND: [
              { startTime: { lt: endTimeDate } },
              { endTime: { gt: startTimeDate } },
            ],
          },
        });

        if (overlappingBooking) {
          throw new Error("Jadwal baru saja dipesan orang lain.");
        }

        const booking = await tx.booking.create({
          data: {
            userId,
            courtId: court.id,
            bookingDate: bookingDateObj,
            startTime: startTimeDate,
            endTime: endTimeDate,
            totalPrice: court.pricePerHour,
            status: 'PENDING',
          },
        });
        return booking;
      });
      console.log(`[${label}] SUKSES - Booking ID: ${result.id}`)
    } catch (error: any) {
      console.log(`[${label}] GAGAL - Pesan: ${error.message}`)
    }
  }

  // Get two users (create dummies if needed)
  let user1 = await prisma.user.findFirst()
  if (!user1) throw new Error("Need a user to test.")

  // Clean up previous test bookings
  await prisma.booking.deleteMany({
    where: { courtId: court.id, bookingDate: new Date(`${dateStr}T00:00:00.000Z`) }
  })
  
  console.log("Mengirim 2 request booking secara BERSAMAAN tanpa await...")
  
  // Execute simultaneously
  await Promise.all([
    attemptBooking(user1.id, "Request A"),
    attemptBooking(user1.id, "Request B")
  ])
  
  console.log("=== Selesai ===")
}

runConcurrencyTest().finally(() => prisma.$disconnect())
