import { Suspense } from 'react'
import RegisterForm from './RegisterForm'
import FooterPublic from '@/components/FooterPublic'
import Link from 'next/link'

export default function RegisterPage() {
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

      {/* Main Content */}
      <div className="w-full max-w-md mx-auto px-6 py-8">
        <Suspense fallback={
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-200 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Memuat Formulir...</p>
          </div>
        }>
          <RegisterForm />
        </Suspense>
      </div>

      <FooterPublic />
    </div>
  )
}
