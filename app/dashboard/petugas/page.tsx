import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import TombolLogoutAdmin from "@/components/TombolLogoutAdmin"

export default async function DashboardPetugas() {
  const session = await auth()
  
  // Proteksi: Hanya PETUGAS yang bisa masuk
  if (session?.user?.role !== "PETUGAS") redirect("/")

  // Ambil statistik tugas
  const totalKomplain = await prisma.komplain.count({
    where: { status: { in: ['PENDING', 'PROSES'] } }
  })

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-10">
        
        {/* Header Petugas */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Staff Dashboard</p>
            <h1 className="text-4xl font-black italic tracking-tighter text-emerald-600 uppercase">
              Action.
            </h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <span className="text-white font-black text-xs uppercase">St</span>
          </div>
        </header>

        {/* Info Petugas & Status Presensi */}
        <div className="bg-emerald-600 text-white p-8 rounded-[3rem] shadow-2xl shadow-emerald-200 relative overflow-hidden mb-10">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mb-1">Selamat Bertugas,</p>
            <h2 className="text-2xl font-black tracking-tighter mb-6 uppercase italic">
              {session.user?.name || "Petugas"}
            </h2>
            
            <div className="flex items-center gap-2 bg-white/20 w-fit px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Status: Aktif</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 opacity-10 text-white text-[10rem] font-black italic">!</div>
        </div>

        {/* Menu Navigasi Petugas */}
        <div className="grid grid-cols-1 gap-4 mb-10">
           
           {/* Tombol Absensi */}
           <Link 
             href="/dashboard/petugas/absensi"
             className="bg-gray-50 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100 shadow-sm"
           >
              <div className="flex items-center gap-6">
                <div className="text-4xl bg-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">📍</div>
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Presence</p>
                  <h3 className="text-lg font-black italic tracking-tighter text-gray-900 uppercase">Absensi Harian</h3>
                </div>
              </div>
              <span className="text-2xl text-gray-300 group-hover:text-emerald-600">→</span>
           </Link>

           {/* Tombol Daftar Komplain */}
           <Link 
             href="/dashboard/petugas/komplain"
             className="bg-gray-50 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100 shadow-sm"
           >
              <div className="flex items-center gap-6">
                <div className="text-4xl bg-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">🛠️</div>
                <div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Work Orders</p>
                  <h3 className="text-lg font-black italic tracking-tighter text-gray-900 uppercase">Tugas Perbaikan</h3>
                  {totalKomplain > 0 && (
                    <span className="inline-block mt-1 bg-orange-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black">
                      {totalKomplain} LAPORAN
                    </span>
                  )}
                </div>
              </div>
              <span className="text-2xl text-gray-300 group-hover:text-orange-600">→</span>
           </Link>

        </div>

        {/* Footer */}
        <div className="flex flex-col items-center border-t border-gray-100 pt-10 gap-6">
            <TombolLogoutAdmin />
            <Link href="/" className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] hover:text-black transition-colors">
              ← Beranda Utama
            </Link>
        </div>

      </div>
    </div>
  )
}