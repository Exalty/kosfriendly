const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Langsung pakai PrismaClient tanpa adapter tambahan agar stabil di terminal
const prisma = new PrismaClient();

async function main() {
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordPemilik = await bcrypt.hash('pemilik123', 10);
  const passwordPetugas = await bcrypt.hash('petugas123', 10);

  console.log('Sedang membuat user...');

  // Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@kos.com' },
    update: {},
    create: { nama: 'Admin', email: 'admin@kos.com', password: passwordAdmin, role: 'ADMIN' }
  });

  // Create Pemilik
  await prisma.user.upsert({
    where: { email: 'pemilik@kos.com' },
    update: {},
    create: { nama: 'Pemilik', email: 'pemilik@kos.com', password: passwordPemilik, role: 'PEMILIK' }
  });

  // Create Petugas
  await prisma.user.upsert({
    where: { email: 'petugas@kos.com' },
    update: {},
    create: { nama: 'Petugas', email: 'petugas@kos.com', password: passwordPetugas, role: 'PETUGAS' }
  });

  console.log('✅ SEMUA USER BERHASIL DIBUAT!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });