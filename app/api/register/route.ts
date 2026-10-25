import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
      try {
        const body = await req.json()
        const { nama, email, password, kamarId } = body

        // 1. Validasi Input (Memenuhi Use Case Register Langkah 4)
        if (!nama || !email || !password) {
          return NextResponse.json({ message: 'Seluruh kolom pendaftaran wajib diisi' }, { status: 400 })
        }
        if (typeof password !== 'string' || password.length < 8) {
          return NextResponse.json({ message: 'Kata sandi minimal harus 8 karakter' }, { status: 400 })
        }

        // 2. Sanitasi Foreign Key kamarId (Mencegah FK Constraint Failure)
        const validKamarId = (typeof kamarId === 'string' && kamarId.trim() !== '') ? kamarId : null

        // 3. Pencegahan Celah Double Booking (Memenuhi FR-03 & Integritas Kamar)
        if (validKamarId) {
          const kamar = await prisma.kamar.findUnique({
            where: { id: validKamarId },
            include: { penghuni: true }
          })
          if (!kamar) {
            return NextResponse.json({ message: 'Kamar yang dipilih tidak valid' }, { status: 404 })
          }
          if (kamar.penghuni.length > 0) {
            return NextResponse.json({ message: 'Kamar ini sudah terisi oleh penghuni lain' }, { status: 409 })
          }
        }

        // 4. Verifikasi Email Unik (Memenuhi Use Case Register Langkah 5)
        const userAda = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() }
        })
        if (userAda) {
          return NextResponse.json({ message: 'Email ini sudah terdaftar' }, { status: 400 })
        }

        // 5. Enkripsi Password & Penyimpanan Data (Memenuhi NFR-08 & Langkah 6)
        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.create({
          data: {
            nama: nama.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: 'PELANGGAN',
            kamarId: validKamarId
          }
        })

        return NextResponse.json({ message: 'Akun berhasil dibuat' }, { status: 201 })
      } catch (error) {
        console.error('[REGISTER_AUDIT_ERROR]:', error)
        return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 })
      }
    }