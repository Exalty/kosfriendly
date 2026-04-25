'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
// Pastikan import action register kamu sudah benar di sini:
// import { registerAction } from './action' 

export default function RegisterForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [loading, setLoading] = useState(false)

  // Fungsi handle submit (sesuaikan dengan logic kamu)
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // setLoading(true)
    // logic registerAction
    // setLoading(false)
  }

  return (
    <div className="w-full max-w-md p-10 bg-white rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100">
      
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase leading-none">Daftar Akun.</h1>
        <p className="text-xs text-gray-400 mt-2 font-medium">Lengkapi data diri untuk akses KosFriendly</p>
      </header>
      
      {/* Alert Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-[10px] font-black uppercase tracking-widest text-center border border-red-100">
          {error === 'CredentialsSignin' ? 'Email sudah terdaftar' : 'Terjadi Kesalahan'}
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