"use server"

import { prisma } from "../../../lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function simpanKamar(formData: FormData) {
  const nomorKamar = formData.get("nomorKamar") as string
  const tipe = formData.get("tipe") as string
  const harga = parseInt(formData.get("harga") as string)
  const fasilitas = formData.get("fasilitas") as string

  try {
    await prisma.kamar.create({
      data: {
        nomorKamar,
        tipe,
        harga,
        fasilitas
      }
    })
    revalidatePath("/dashboard/admin/kamar")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Nomor kamar mungkin sudah ada" }
  }
}

export async function hapusKamar(id: string) {
  try {
    await prisma.kamar.delete({
      where: { id }
    })
    revalidatePath("/dashboard/admin/kamar")
    return { success: true }
  } catch (error) {
    return { success: false, message: "Gagal menghapus kamar" }
  }
}

export async function getKamarKosong(tipe: string) {
  return await prisma.kamar.findMany({
    where: {
      tipe: tipe,
      penghuni: {
        none: {} // Cari kamar yang TIDAK punya penghuni sama sekali
      }
    },
    orderBy: { nomorKamar: 'asc' }
  })
}

export async function updateKamar(id: string, formData: FormData) {
  const nomorKamar = formData.get('nomorKamar') as string
  const tipe = formData.get('tipe') as string
  const harga = Number(formData.get('harga'))
  const fasilitas = formData.get('fasilitas') as string

  await prisma.kamar.update({
    where: { id },
    data: {
      nomorKamar,
      tipe,
      harga,
      fasilitas,
    },
  })

  revalidatePath('/dashboard/admin/kamar')
  redirect('/dashboard/admin/kamar')
}