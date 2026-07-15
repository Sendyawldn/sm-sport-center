import 'dotenv/config'
import { prisma } from '../lib/prisma'
import cron from 'node-cron'

console.log("Starting Auto-Cancel Cron Job...")

// Runs every minute
cron.schedule('* * * * *', async () => {
  try {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000)

    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: fifteenMinsAgo
        }
      }
    })

    if (expiredBookings.length > 0) {
      console.log(`Menemukan ${expiredBookings.length} booking kadaluarsa. Mengubah ke CANCELLED...`)
      
      const res = await prisma.booking.updateMany({
        where: {
          id: {
            in: expiredBookings.map((b: any) => b.id)
          }
        },
        data: {
          status: 'CANCELLED'
        }
      })
      
      console.log(`Berhasil mengubah ${res.count} booking menjadi CANCELLED.`)
    }
  } catch (error) {
    console.error("Gagal menjalankan cron job auto-cancel:", error)
  }
})

// Keep process alive
process.stdin.resume()
