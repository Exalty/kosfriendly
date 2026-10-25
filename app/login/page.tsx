'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FooterPublic from '@/components/FooterPublic'

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

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (!result || result.error) {
        setError('Email atau kata sandi tidak cocok')
        setLoading(false)
        return
      }

      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error('Login error:', err)
      setError('Terjadi kendala koneksi ke server')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/70 flex flex-col font-sans text-gray-900 justify-between">
      {/* Top Bar Header */}
      <div className="w-full max-w-lg mx-auto px-6 pt-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xs font-bold text-gray-600 hover:text-black uppercase tracking-wider transition-colors inline-flex items-center gap-1"
        >
          ← Beranda
        </Link>
        <span className="text-xs font-black italic tracking-tighter text-gray-900 uppercase">
          KOSFRIENDLY.
        </span>
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-md mx-auto px-6 py-6">
        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-gray-200 shadow-xl shadow-gray-200/50">
          
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-950 text-white rounded-2xl mb-3 text-2xl shadow-md">
              🏠
            </div>
            <h1 className="text-3xl font-black italic tracking-tight text-gray-950 uppercase leading-none">
              Masuk Akun
            </h1>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              Akses akun KosFriendly Anda untuk kelola hunian
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                Alamat Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-2xl py-3.5 px-4 text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-2xl py-3.5 px-4 text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400"
                required
              />
            </div>

            {/* Ingat Aku & Lupa Password */}
            <div className="flex justify-between items-center px-1 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="ingat"
                  checked={ingat}
                  onChange={e => setIngat(e.target.checked)}
                  className="w-4 h-4 rounded text-black accent-black cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-700">
                  Ingat saya
                </span>
              </label>
              <span className="text-xs font-semibold text-gray-400">Lupa sandi?</span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 text-xs font-bold py-3 px-4 rounded-xl text-center border border-red-200 mt-1">
                {error}
              </div>
            )}

            {/* Tombol Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-950 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black transition shadow-lg active:scale-95 disabled:bg-gray-400 mt-2"
            >
              {loading ? 'Memproses...' : 'Masuk Sekarang →'}
            </button>

            {/* Seksi Tombol Daftar Akun Baru */}
            <div className="border-t border-gray-100 pt-5 mt-3 text-center">
              <p className="text-xs text-gray-500 font-medium mb-3">
                Belum memiliki akun pelanggan?
              </p>
              <Link 
                href="/register" 
                className="block w-full py-3.5 bg-gray-50 text-gray-900 border border-gray-300 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-gray-100 hover:border-black transition-all shadow-sm"
              >
                + Buat Akun Baru Sekarang
              </Link>
            </div>
          </form>
        </div>
      </div>

      <FooterPublic />
    </div>
  )
}
