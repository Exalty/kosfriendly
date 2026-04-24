'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ingat, setIngat] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

if (result?.error) {
  setError('Email atau password salah')
  setLoading(false)
} else {
  // Paksa refresh agar session terbaca oleh middleware
  router.refresh() 
  // Cukup arahkan ke sini, sisanya urusan middleware
  router.push('/dashboard') 
}
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 pt-16">
      
      {/* Logo */}
      <div className="w-48 h-36 bg-gray-200 rounded-lg mb-8" />

      {/* Judul */}
      <h1 className="text-3xl font-light text-gray-700 mb-8">Sign In</h1>

      {/* Form */}
     {/* Form */}
    <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-6">
      
      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
          E-mail
        </label>
        <input
          type="email"
          placeholder="Masukkan e-mail anda"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border-b-2 border-gray-100 py-3 px-1 text-gray-900 font-bold text-base focus:outline-none focus:border-black transition-all placeholder:text-gray-200 bg-transparent"
          required
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border-b-2 border-gray-100 py-3 px-1 text-gray-900 font-bold text-base focus:outline-none focus:border-black transition-all placeholder:text-gray-200 bg-transparent"
          required
        />
      </div>

      {/* Ingat Aku & Lupa Password */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ingat"
            checked={ingat}
            onChange={e => setIngat(e.target.checked)}
            className="w-4 h-4 accent-black cursor-pointer"
          />
          <label htmlFor="ingat" className="text-xs font-bold text-gray-500 cursor-pointer uppercase">
            Ingat aku
          </label>
        </div>
        {/* Opsional: Tombol Lupa Password */}
        <span className="text-[10px] font-bold text-gray-300 uppercase cursor-not-allowed">Lupa?</span>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-500 text-[10px] font-bold py-3 px-4 rounded-xl text-center uppercase tracking-tighter border border-red-100">
          {error}
        </div>
      )}

      {/* Tombol Sign In */}
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white py-4 rounded-2xl text-[11px] font-black tracking-[0.2em] hover:bg-gray-800 transition shadow-lg active:scale-95 disabled:bg-gray-400"
      >
        {loading ? 'SABAR YA...' : 'SIGN IN'}
      </button>

      <Link 
        href="/" 
        className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors mt-2"
      >
        ← Kembali ke Beranda
      </Link>

    </form>
    </div>
  )
}