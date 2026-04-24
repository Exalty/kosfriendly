'use client'

import { useTransition } from "react"
import { submitAbsensi } from "@/app/dashboard/petugas/absensi/action"

// PASTI KAN ADA KATA 'default' DI SINI
export default function TombolAbsen() {
  const [isPending, startTransition] = useTransition()

  return (
    <button 
      onClick={() => startTransition(() => submitAbsensi())}
      disabled={isPending}
      className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100 active:scale-95 transition-all disabled:opacity-50"
    >
      {isPending ? "MENGIRIM..." : "KLIK UNTUK HADIR"}
    </button>
  )
}