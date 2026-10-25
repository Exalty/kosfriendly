import { auth } from "@/auth"
import { prisma } from "../../lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import TombolLogoutAdmin from "@/components/TombolLogoutAdmin"

export default async function DashboardAdmin() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/")

  // Ambil statistik sederhana untuk dashboard
  const totalKamar = await prisma.kamar.count()
  const totalPenghuni = await prisma.user.count({ where: { role: "PELANGGAN" } })
  const totalKomplain = await prisma.komplain.count({ where: { status: "PENDING" } })

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans text-gray-900">
      <div className="max-w-md mx-auto pt-6">
        
        {/* Header Admin */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Administrator</p>
            <h1 className="text-3xl font-black italic tracking-tight text-gray-950 uppercase">
              Control Panel
            </h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-950 flex items-center justify-center shadow-md">
            <span className="text-white font-black text-xs">AD</span>
          </div>
        </header>

        {/* Kartu Statistik Utama */}
        <div className="bg-gray-950 text-white p-7 rounded-[2.5rem] shadow-xl relative overflow-hidden mb-8">
          <div className="absolute -top-4 -right-4 opacity-10 select-none">
            <span className="text-[9rem] font-black italic leading-none">#1</span>
          </div>
          
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status Hunian</p>
            <h2 className="text-4xl font-black tracking-tight mb-6">
              {totalPenghuni} <span className="text-lg font-semibold text-gray-400">Penghuni Aktif</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Total Kamar</p>
                <p className="text-sm font-black uppercase text-white mt-0.5">{totalKamar} Unit</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-400 uppercase">Laporan Baru</p>
                <p className="text-sm font-black text-rose-400 mt-0.5">{totalKomplain} Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigasi Admin */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* Kelola Kamar */}
          <Link 
            href="/dashboard/admin/kamar"
            className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:shadow-md transition-all border border-gray-200 hover:border-gray-950"
          >
            <div className="text-3xl">🔑</div>
            <span className="text-xs font-bold uppercase text-gray-800 group-hover:text-black">Unit Kos</span>
          </Link>

          {/* Kelola Pembayaran */}
          <Link 
            href="/dashboard/admin/bayar"
            className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:shadow-md transition-all border border-gray-200 hover:border-gray-950"
          >
            <div className="text-3xl">💰</div>
            <span className="text-xs font-bold uppercase text-gray-800 group-hover:text-black">Keuangan</span>
          </Link>

          {/* Kelola Komplain */}
          <Link 
            href="/dashboard/admin/komplain"
            className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:shadow-md transition-all border border-gray-200 hover:border-gray-950"
          >
            <div className="text-3xl">📣</div>
            <span className="text-xs font-bold uppercase text-gray-800 group-hover:text-black">Laporan</span>
          </Link>
        </div>

        {/* Navigasi Bawah & Logout */}
        <div className="flex flex-col items-center border-t border-gray-200 pt-8 gap-4">
          <TombolLogoutAdmin />
          
          <Link 
            href="/" 
            className="text-xs font-bold text-gray-600 uppercase tracking-wider hover:text-black transition-colors"
          >
            ← Lihat Beranda Publik
          </Link>
        </div>
      </div>
    </div>
  )
}
