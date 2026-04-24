"use server"

import { prisma } from "../../../lib/prisma"
import { revalidatePath } from "next/cache"

export async function konfirmasiPembayaran(pembayaranId: string, status: "BERHASIL" | "GAGAL") {
  try {
    await prisma.pembayaran.update({
      where: { id: pembayaranId },
      data: { status: status },
    })

    revalidatePath("/admin/bayar")
  } catch (error) {
    console.error("Gagal update status pembayaran:", error)
    throw new Error("Gagal memproses data")
  }
}