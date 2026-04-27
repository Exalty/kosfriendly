import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Buat Akun Users (Sudah benar)
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

  // 2. Tambahkan Data Kamar (Agar muncul di website)
  console.log('Sedang membuat data kamar...')
  
  const kamarData = [
    { nomorKamar: '101', tipe: 'Reguler', harga: 500000, fasilitas: 'Kasur, Lemari, Kipas Angin' },
    { nomorKamar: '102', tipe: 'Reguler', harga: 500000, fasilitas: 'Kasur, Lemari, Kipas Angin' },
    { nomorKamar: '201', tipe: 'VIP', harga: 1200000, fasilitas: 'AC, TV, Kasur King Size, Kamar Mandi Dalam' },
    { nomorKamar: '202', tipe: 'VIP', harga: 1200000, fasilitas: 'AC, TV, Kasur King Size, Kamar Mandi Dalam' },
  ]

  for (const k of kamarData) {
    await prisma.kamar.upsert({
      where: { nomorKamar: k.nomorKamar },
      update: {},
      create: k
    })
  }

  console.log('Semua user dan data kamar berhasil dibuat!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())