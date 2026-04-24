"use server"

import { prisma } from "../../lib/prisma"
import { revalidatePath } from "next/cache"

export async function buatPembayaran(formData: FormData, userId: string) {
  const jumlah = parseInt(formData.get("jumlah") as string)
  const metode = formData.get("metode") as string
  const catatan = formData.get("catatan") as string

  if (!userId) throw new Error("ID User tidak ditemukan")

  try {
    await prisma.pembayaran.create({
      data: {
        jumlah,
        metode,
        catatan,
        userId: userId,
        status: "PENDING"
      },
    })

    revalidatePath("/dashboard/bayar")
  } catch (error) {
    console.error("Gagal simpan pembayaran:", error)
    throw new Error("Gagal mengirim konfirmasi pembayaran")
  }
}