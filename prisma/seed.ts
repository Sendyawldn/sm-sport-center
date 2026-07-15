import 'dotenv/config'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smsport.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@smsport.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  
  console.log({ admin })

  // Seed Courts
  const courts = [
    { id: 'futsal-1', name: 'Lapangan Futsal 1', type: 'FUTSAL' as const, pricePerHour: 150000 },
    { id: 'futsal-2', name: 'Lapangan Futsal 2', type: 'FUTSAL' as const, pricePerHour: 150000 },
    { id: 'badminton-1', name: 'Lapangan Badminton 1', type: 'BADMINTON' as const, pricePerHour: 50000 },
    { id: 'badminton-2', name: 'Lapangan Badminton 2', type: 'BADMINTON' as const, pricePerHour: 50000 },
    { id: 'badminton-3', name: 'Lapangan Badminton 3', type: 'BADMINTON' as const, pricePerHour: 50000 },
  ]

  for (const court of courts) {
    const createdCourt = await prisma.court.upsert({
      where: { id: court.id },
      update: {},
      create: {
        id: court.id,
        name: court.name,
        type: court.type,
        pricePerHour: court.pricePerHour,
        status: 'AVAILABLE'
      }
    })
    console.log(`Upserted court: ${createdCourt.name}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
