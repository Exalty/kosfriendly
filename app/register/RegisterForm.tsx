'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const kamarId = searchParams.get('kamarId')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const nama = formData.get('nama') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password, kamarId })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.message || 'Pendaftaran gagal')
        setLoading(false)
        return
      }

      // Berhasil daftar, arahkan ke halaman login
      router.push('/login?registered=true')
    } catch (err) {
      setErrorMessage('Terjadi gangguan jaringan atau server')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-200 text-gray-900">
      
      {/* Header Title */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-950 text-white rounded-2xl mb-4 text-2xl shadow-md">
          ✨
        </div>
        <h1 className="text-3xl font-black italic tracking-tight text-gray-950 uppercase leading-none">
          Daftar Akun
        </h1>
        <p className="text-xs text-gray-600 mt-2 font-medium">
          Lengkapi data diri untuk memesan kamar KosFriendly
        </p>
      </header>
      
      {/* Alert Error / Notification */}
      {errorMessage && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-5 text-xs font-bold text-center border border-red-200">
          {errorMessage}
        </div>
      )}
      {kamarId && (
        <div className="bg-blue-50 text-blue-800 p-3.5 rounded-2xl mb-5 text-xs font-bold text-center border border-blue-200">
          ✓ Mendaftar untuk pemesanan kamar terpilih
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase ml-1 tracking-wider">
            Nama Lengkap
          </label>
          <input 
            name="nama" 
            placeholder="Misal: Alex Kurniawan" 
            className="w-full py-3.5 px-4 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm border border-gray-300 text-gray-900 placeholder:text-gray-400 font-medium" 
            required 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase ml-1 tracking-wider">
            Alamat Email
          </label>
          <input 
            name="email" 
            type="email" 
            placeholder="alex@email.com" 
            className="w-full py-3.5 px-4 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm border border-gray-300 text-gray-900 placeholder:text-gray-400 font-medium" 
            required 
          />
        </div>

        <div className="space-y-1.5 mb-2">
          <label className="text-xs font-bold text-gray-700 uppercase ml-1 tracking-wider">
            Kata Sandi
          </label>
          <input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            className="w-full py-3.5 px-4 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-sm border border-gray-300 text-gray-900 placeholder:text-gray-400 font-medium" 
            required 
          />
        </div>

        {/* Tombol Utama */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gray-950 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all disabled:opacity-50 hover:bg-black mt-2"
        >
          {loading ? 'Memproses...' : 'Daftar Sekarang →'}
        </button>
      </form>

      {/* Footer Form */}
      <p className="text-center text-xs text-gray-600 mt-6 font-medium">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-bold text-gray-950 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  )
}
