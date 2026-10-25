import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const userId = formData.get('userId') as string
    const jumlahStr = formData.get('jumlah') as string
    const file = formData.get('bukti') as File | null

    if (!userId) {
      return NextResponse.json({ message: 'User ID tidak valid' }, { status: 400 })
    }

    if (!file || typeof file === 'string' || file.size === 0) {
      return NextResponse.json({ message: 'File bukti transfer wajib diunggah' }, { status: 400 })
    }

    // Batasi ukuran file (maksimal 4.5 MB agar pas untuk payload base64 di database)
    const MAX_SIZE = 4.5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: 'Ukuran foto maksimal 4.5 MB. Silakan gunakan foto yang lebih kecil.' }, { status: 400 })
    }

    // Konversi file gambar ke Base64 Data URL agar aman di serverless Vercel
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const mimeType = file.type || 'image/jpeg'
    const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`

    const jumlah = parseInt(jumlahStr, 10) || 0

    // Simpan data pembayaran ke database
    const pembayaran = await prisma.pembayaran.create({
      data: {
        userId,
        jumlah,
        metode: 'TRANSFER BANK',
        buktiBayar: base64Data,
        status: 'PENDING'
      }
    })

    console.log('[PAYMENT_SUCCESS]: Bukti transfer berhasil disimpan. ID:', pembayaran.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Bukti pembayaran berhasil diunggah',
      id: pembayaran.id 
    }, { status: 201 })

  } catch (error: any) {
    console.error('[PAYMENT_UPLOAD_ERROR]:', error)
    return NextResponse.json({ 
      message: 'Terjadi kesalahan server saat menyimpan bukti pembayaran',
      error: error.message 
    }, { status: 500 })
  }
}
