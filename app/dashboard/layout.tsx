'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const getDashboardHome = () => {
    const role = (session?.user as any)?.role
    if (role === 'ADMIN') return '/dashboard/admin'
    if (role === 'PEMILIK') return '/dashboard/pemilik'
    if (role === 'PETUGAS') return '/dashboard/petugas'
    return '/dashboard'
  }

  const dashboardHome = getDashboardHome()
  const isAtHome = pathname === dashboardHome

  return (
    <div className="relative min-h-screen bg-white">
      {/* Tombol Back ala Aplikasi Mobile */}
      {!isAtHome && (
        <div className="fixed top-4 left-4 z-[99] animate-in fade-in slide-in-from-left-2 duration-300">
          <Link 
            href={dashboardHome}
            className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full shadow-md active:scale-90 transition-transform"
          >
            <span className="text-xl">←</span>
          </Link>
        </div>
      )}

      {/* Konten Utama */}
      <div className="w-full max-w-md mx-auto">
        {children}
      </div>

      {/* Padding Bawah Ekstra agar tidak tertutup Footer di HP */}
      <div className="h-20 w-full" />
    </div>
  )
}