import { auth } from "@/auth"
import { prisma } from "../../lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import { signOut } from "next-auth/react"
import TombolLogoutAdmin from "@/components/TombolLogoutAdmin"

export default async function DashboardAdmin() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/")

  // Ambil statistik sederhana untuk dashboard
  const totalKamar = await prisma.kamar.count()
  const totalPenghuni = await prisma.user.count({ where: { role: "PELANGGAN" } })
  const totalKomplain = await prisma.komplain.count({ where: { status: "PENDING" } })

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-10">
        
        {/* Header Admin */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Administrator</p>
            <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase">
              Control.
            </h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-xs">AD</span>
          </div>
        </header>

        {/* Kartu Statistik Utama (Gaya Mirip Kartu Kamar Pelanggan) */}
        <div className="bg-black text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden mb-10">
          <div className="absolute -top-4 -right-4 opacity-10 select-none">
            <span className="text-[10rem] font-black italic leading-none">#1</span>
          </div>
          
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status Hunian</p>
            <h2 className="text-5xl font-black tracking-tighter mb-8">{totalPenghuni} <span className="text-xl text-gray-500">Penghuni</span></h2>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-[9px] font-bold text-gray-500 uppercase">Total Kamar</p>
                <p className="text-sm font-black uppercase tracking-tight">{totalKamar} Unit</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-gray-500 uppercase">Laporan Baru</p>
                <p className="text-sm font-black text-red-500">{totalKomplain} Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigasi Admin (Grid 3 Kolom agar Seragam) */}
        <div className="grid grid-cols-3 gap-4">
           {/* Kelola Kamar */}
           <Link 
             href="/dashboard/admin/kamar"
             className="bg-gray-50 p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100"
           >
              <div className="text-2xl">🔑</div>
              <span className="text-[8px] font-black uppercase text-gray-400 group-hover:text-black tracking-tighter">Unit Kos</span>
           </Link>

           {/* Kelola Pembayaran */}
           <Link 
             href="/dashboard/admin/bayar"
             className="bg-gray-50 p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100"
           >
              <div className="text-2xl">💰</div>
              <span className="text-[8px] font-black uppercase text-gray-400 group-hover:text-black tracking-tighter">Keuangan</span>
           </Link>

           {/* Kelola Komplain */}
           <Link 
             href="/dashboard/admin/komplain"
             className="bg-gray-50 p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100"
           >
              <div className="text-2xl">📣</div>
              <span className="text-[8px] font-black uppercase text-gray-400 group-hover:text-black tracking-tighter">Laporan</span>
           </Link>
        </div>
        {/* Tombol Logout di paling bawah atau dibuat simpel */}
        <div className="flex flex-col items-center border-t border-gray-100 pt-10 gap-4">
           <TombolLogoutAdmin />
           
           <Link 
              href="/" 
              className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] hover:text-black transition-colors"
           >
              ← Preview Beranda Umum
           </Link>
        </div>
      </div>
    </div>
  )
}