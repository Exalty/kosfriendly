"use server"

import { prisma } from "../../../lib/prisma"
import { revalidatePath } from "next/cache"

type StatusKomplain = "PENDING" | "PROSES" | "SELESAI"

export async function updateStatusKomplain(id: string, statusBaru: StatusKomplain) {
  try {
    await prisma.komplain.update({
      where: { id },
      data: { 
        status: statusBaru 
      },
    })

    revalidatePath('/dashboard/admin/komplain')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}