"use client"

import { hapusKamar } from "./action"

export default function TombolHapus({ id, nomor }: { id: string, nomor: string }) {
  const handleHapus = async () => {
    const tanya = confirm(`Apakah kamu yakin ingin menghapus Kamar ${nomor}?`)
    
    if (tanya) {
      const res = await hapusKamar(id)
      if (!res.success) {
        alert(res.message)
      }
    }
  }

  return (
    <button 
      onClick={handleHapus}
      className="text-[10px] font-bold text-red-300 uppercase hover:text-red-600 transition-colors py-2 px-4"
    >
      Hapus
    </button>
  )
}