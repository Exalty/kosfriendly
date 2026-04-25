'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
// Import action register kamu di sini, misal:
// import { registerAction } from './action' 

export default function RegisterForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [loading, setLoading] = useState(false)

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
      <h1 className="text-3xl font-black italic mb-6">Daftar Akun.</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-4 text-xs font-bold uppercase">
          {error === 'CredentialsSignin' ? 'Email atau Password Salah' : 'Terjadi Kesalahan'}
        </div>
      )}

      <form className="space-y-4">
        {/* Input fields kamu di sini (Nama, Email, Password, dll) */}
        <input 
          name="nama" 
          placeholder="Nama Lengkap" 
          className="w-full p-4 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          required 
        />
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          className="w-full p-4 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          required 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          className="w-full p-4 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          required 
        />

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Proses...' : 'Daftar Sekarang'}
        </button>
      </form>
    </div>
  )
}