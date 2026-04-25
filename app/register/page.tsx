import { Suspense } from 'react'
import RegisterForm from './RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      {/* Suspense ini adalah "penyelamat" build Vercel. 
          Dia membungkus komponen yang pakai useSearchParams()
      */}
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Memuat Halaman...</p>
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  )
}