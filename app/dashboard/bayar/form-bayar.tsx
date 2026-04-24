'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function FormBayar({ userId, jumlah }: { userId: string, jumlah: number }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/pembayaran/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        alert("BUKTI BERHASIL DIUPLOAD! Tunggu verifikasi admin.")
        router.push('/dashboard')
        router.refresh()
      } else {
        alert("Gagal mengupload bukti transfer.")
      }
    } catch (err) {
      alert("Error koneksi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-6">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="jumlah" value={jumlah.toString()} />
      
      <div className="space-y-2">
        <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-[0.2em]">Foto Bukti Transfer</label>
        <input 
          type="file" 
          name="bukti" 
          accept="image/*"
          required
          className="w-full text-[10px] font-bold text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-black file:text-white hover:file:bg-indigo-600 transition-all cursor-pointer bg-white border border-gray-200 rounded-2xl p-2"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-5 rounded-[1.8rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 disabled:opacity-50 active:scale-95 transition-all"
      >
        {loading ? "PROSES KIRIM..." : "KONFIRMASI BAYAR →"}
      </button>
    </form>
  )
}