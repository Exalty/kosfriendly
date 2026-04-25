import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Buat Admin
  const hashAdmin = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@kos.com' },
    update: {},
    create: {
      nama: 'Admin',
      email: 'admin@kos.com',
      password: hashAdmin,
      role: 'ADMIN'
    }
  })

  // Buat Pemilik
  const hashPemilik = await bcrypt.hash('pemilik123', 10)
  await prisma.user.upsert({
    where: { email: 'pemilik@kos.com' },
    update: {},
    create: {
      nama: 'Pemilik',
      email: 'pemilik@kos.com',
      password: hashPemilik,
      role: 'PEMILIK'
    }
  })

  // Buat Petugas
  const hashPetugas = await bcrypt.hash('petugas123', 10)
  await prisma.user.upsert({
    where: { email: 'petugas@kos.com' },
    update: {},
    create: {
      nama: 'Petugas',
      email: 'petugas@kos.com',
      password: hashPetugas,
      role: 'PETUGAS'
    }
  })

  console.log('Semua user berhasil dibuat!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())