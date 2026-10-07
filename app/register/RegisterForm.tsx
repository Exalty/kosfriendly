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
    <div className="w-full max-w-md p-10 bg-white rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100">
      
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase leading-none">Daftar Akun.</h1>
        <p className="text-xs text-gray-400 mt-2 font-medium">Lengkapi data diri untuk akses KosFriendly</p>
      </header>
      
      {/* Alert Error / Notification */}
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-[10px] font-black uppercase tracking-widest text-center border border-red-100">
          {errorMessage}
        </div>
      )}
      {kamarId && (
        <div className="bg-indigo-50 text-indigo-700 p-3 rounded-2xl mb-6 text-[10px] font-black uppercase tracking-widest text-center border border-indigo-100">
          Mendaftar untuk pemesanan kamar terpilih
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-3 tracking-widest">Nama Lengkap</label>
          <input 
            name="nama" 
            placeholder="Misal: Alex Kurniawan" 
            className="w-full p-5 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-sm border border-gray-100" 
            required 
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-3 tracking-widest">Email Aktif</label>
          <input 
            name="email" 
            type="email" 
            placeholder="alex@email.com" 
            className="w-full p-5 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-sm border border-gray-100" 
            required 
          />
        </div>

        <div className="space-y-1 mb-8">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-3 tracking-widest">Password</label>
          <input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            className="w-full p-5 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-sm border border-gray-100" 
            required 
          />
        </div>

        {/* Tombol Utama */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 active:scale-95 transition-all disabled:opacity-50 mt-4"
        >
          {loading ? 'MEMPROSES...' : 'DAFTAR SEKARANG →'}
        </button>
      </form>

      {/* Footer Form */}
      <p className="text-center text-xs text-gray-400 mt-8 font-medium">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-bold text-black-600 hover:underline">
          Login di sini
        </Link>
      </p>
    </div>
  )
}