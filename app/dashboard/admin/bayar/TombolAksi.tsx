'use client'

import { konfirmasiPembayaran } from "./action"
import { useState } from "react"

export default function TombolAksi({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleAction = async (status: "BERHASIL" | "GAGAL") => {
    if (!confirm(`Yakin ingin mengubah status ke ${status}?`)) return
    
    setLoading(true)
    try {
      await konfirmasiPembayaran(id, status)
    } catch (err) {
      alert("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        disabled={loading}
        onClick={() => handleAction("BERHASIL")}
        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-green-700 transition-colors"
      >
        TERIMA
      </button>
      <button 
        disabled={loading}
        onClick={() => handleAction("GAGAL")}
        className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold text-xs hover:bg-gray-200 transition-colors"
      >
        TOLAK
      </button>
    </>
  )
}