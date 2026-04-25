import { Suspense } from 'react'
import RegisterForm from './RegisterForm'

export default function RegisterPage() {
  return (
    // bg-white atau bg-[#fdfdfd] agar clean
    <div className="min-h-screen flex items-center justify-center bg-white font-sans">
      <Suspense fallback={<p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Loading...</p>}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}