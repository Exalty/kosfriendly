'use client'

// SESUAIKAN PATH IMPORT INI dengan lokasi action.ts kamu
import { updateStatusKomplain } from "@/app/dashboard/admin/komplain/action"
import { useState } from "react"

// Gunakan tipe yang sama agar TS senang
type StatusKomplain = "PENDING" | "PROSES" | "SELESAI"

export default function StatusAction({ id, statusSaatIni }: { id: string, statusSaatIni: string }) {
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (statusBaru: StatusKomplain) => {
    setLoading(true)
    try {
      await updateStatusKomplain(id, statusBaru)
    } catch (error) {
      alert("Gagal update status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
      {/* Tombol PENDING */}
      <button 
        onClick={() => handleUpdate('PENDING')}
        disabled={loading || statusSaatIni === 'PENDING'}
        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all shadow-sm ${
          statusSaatIni === 'PENDING' 
          ? 'bg-orange-500 text-white' 
          : 'bg-white text-gray-400 border border-gray-100 hover:border-orange-500'
        }`}
      >
        {loading ? '...' : 'Pending'}
      </button>

      {/* Tombol PROSES */}
      <button 
        onClick={() => handleUpdate('PROSES')}
        disabled={loading || statusSaatIni === 'PROSES'}
        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all shadow-sm ${
          statusSaatIni === 'PROSES' 
          ? 'bg-blue-500 text-white' 
          : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-500'
        }`}
      >
        {loading ? '...' : 'Proses'}
      </button>

      {/* Tombol SELESAI */}
      <button 
        onClick={() => handleUpdate('SELESAI')}
        disabled={loading || statusSaatIni === 'SELESAI'}
        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all shadow-sm ${
          statusSaatIni === 'SELESAI' 
          ? 'bg-green-500 text-white' 
          : 'bg-white text-gray-400 border border-gray-100 hover:border-green-500'
        }`}
      >
        {loading ? '...' : 'Selesai'}
      </button>
    </div>
  )
}