'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const kamarId = searchParams.get('kamarId')
  const router = useRouter()
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [setuju, setSetuju] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!setuju) {
      setError('Harap setujui aturan dan kondisi')
      setLoading(false)
      return
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, email, password, kamarId })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message || 'Terjadi kesalahan')
      setLoading(false)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 pt-16 font-sans">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black italic tracking-tighter text-gray-900">JOIN US.</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Mulai petualangan kosmu</p>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="w-full max-w-sm flex flex-col gap-6">

        {/* Nama Lengkap */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            placeholder="Siapa namamu?"
            value={nama}
            onChange={e => setNama(e.target.value)}
            className="w-full border-b-2 border-gray-100 py-3 px-1 text-gray-900 font-bold text-base focus:outline-none focus:border-black transition-all placeholder:text-gray-200 bg-transparent"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
            E-mail
          </label>
          <input
            type="email"
            placeholder="alamat@email.com"
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
            placeholder="Buat password rahasiamu"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border-b-2 border-gray-100 py-3 px-1 text-gray-900 font-bold text-base focus:outline-none focus:border-black transition-all placeholder:text-gray-200 bg-transparent"
            required
          />
        </div>

        {/* Checkbox Setuju */}
        <div className="flex items-center gap-3 px-1">
          <input
            type="checkbox"
            id="setuju"
            checked={setuju}
            onChange={e => setSetuju(e.target.checked)}
            className="w-4 h-4 accent-black cursor-pointer"
          />
          <label htmlFor="setuju" className="text-[10px] font-bold text-gray-500 uppercase cursor-pointer leading-tight">
            Saya setuju dengan aturan & kondisi yang berlaku
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 text-[10px] font-bold py-3 px-4 rounded-xl text-center uppercase tracking-tighter border border-red-100">
            {error}
          </div>
        )}

        {/* Tombol Sign Up */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-4 rounded-2xl text-[11px] font-black tracking-[0.2em] hover:bg-gray-800 transition shadow-lg active:scale-95 disabled:bg-gray-400"
        >
          {loading ? 'MEMPROSES...' : 'DAFTAR SEKARANG'}
        </button>

        {/* Link Kembali */}
        <Link 
          href="/" 
          className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors mt-2"
        >
          ← Batal dan Kembali
        </Link>

        {/* Divider */}
        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Atau</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Link Login */}
        <p className="text-center text-xs text-gray-500">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-black text-black border-b border-black">
            LOG IN
          </Link>
        </p>
        
      </form>
    </div>
  )
}