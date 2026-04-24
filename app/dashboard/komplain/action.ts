// app/dashboard/komplain/action.ts
'use server'

import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"

export async function buatKomplain(formData: FormData) {
  const session = await auth()

  // Pastikan user sudah login
  if (!session?.user?.id) {
    throw new Error("Kamu harus login untuk membuat laporan")
  }

  const subjek = formData.get('subjek') as string
  const deskripsi = formData.get('deskripsi') as string

  await prisma.komplain.create({
    data: {
      subjek,
      deskripsi,
      userId: session.user.id,
      status: "PENDING"
    }
  })

  // Refresh data agar laporan langsung muncul di daftar riwayat
  revalidatePath('/dashboard/komplain')
}