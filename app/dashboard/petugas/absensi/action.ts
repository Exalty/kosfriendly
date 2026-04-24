'use server'

import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitAbsensi() {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.absensi.create({
    data: {
      userId: session.user.id,
      status: "HADIR",
      tanggal: new Date()
    }
  })

  revalidatePath('/dashboard/petugas/absensi')
}