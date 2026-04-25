import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { nama, email, password, kamarId } = await req.json()

    // Cek email sudah terdaftar
    const userAda = await prisma.user.findUnique({
      where: { email }
    })

    if (userAda) {
      return NextResponse.json(
        { message: 'Email ini sudah terdaftar' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Simpan user baru
    await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role: 'PELANGGAN',
        kamarId: kamarId || null
      }
    })

    return NextResponse.json(
      { message: 'Akun berhasil dibuat' },
      { status: 201 }
    )

  } catch (error) {
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}