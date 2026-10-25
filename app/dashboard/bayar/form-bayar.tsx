'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function FormBayar({ userId, jumlah }: { userId: string, jumlah: number }) {
  const [loading, setLoading] = useState(false)
  const [pesan, setPesan] = useState<{ tipe: 'sukses' | 'error', text: string } | null>(null)
  const router = useRouter()

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setPesan(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const file = formData.get('bukti') as File | null

    if (file && file.size > 4.5 * 1024 * 1024) {
      setPesan({ tipe: 'error', text: 'Ukuran foto terlalu besar (maksimal 4.5 MB).' })
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/pembayaran/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok) {
        setPesan({ tipe: 'sukses', text: 'Bukti transfer berhasil dikirim! Menunggu verifikasi admin.' })
        form.reset()
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1500)
      } else {
        setPesan({ tipe: 'error', text: data.message || "Gagal mengupload bukti transfer." })
      }
    } catch (err) {
      setPesan({ tipe: 'error', text: "Terjadi gangguan jaringan atau server." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="jumlah" value={jumlah.toString()} />
      
      {pesan && (
        <div className={`p-4 rounded-2xl text-xs font-bold text-center border ${
          pesan.tipe === 'sukses' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {pesan.text}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
          Upload Foto Bukti Transfer
        </label>
        <input 
          type="file" 
          name="bukti" 
          accept="image/*"
          required
          className="w-full text-xs font-medium text-gray-700 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:bg-gray-950 file:text-white hover:file:bg-black transition-all cursor-pointer bg-white border border-gray-300 rounded-2xl p-2.5 shadow-sm"
        />
        <p className="text-[11px] text-gray-500 ml-1">Format: JPG, PNG, atau WebP (maks. 4.5 MB)</p>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-gray-950 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-black disabled:opacity-50 active:scale-95 transition-all cursor-pointer mt-2"
      >
        {loading ? "Sedang Mengirim Bukti..." : "Kirim Bukti Pembayaran →"}
      </button>
    </form>
  )
}
