import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import TombolLogoutAdmin from "@/components/TombolLogoutAdmin"

export default async function DashboardPemilik() {
  const session = await auth()
  // Proteksi: Hanya Pemilik yang boleh masuk
  if (session?.user?.role !== "PEMILIK") redirect("/")

  // Ambil data statistik untuk Pemilik
  const totalPendapatan = await prisma.pembayaran.aggregate({
    _sum: { jumlah: true },
    where: { status: "BERHASIL" }
  })
  
  const kamarTerisi = await prisma.kamar.count({ where: { penghuni: { some: {}} } })
  const totalLaporan = await prisma.komplain.count()

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-10">
        
        {/* Header Pemilik */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Owner Dashboard</p>
            <h1 className="text-4xl font-black italic tracking-tighter text-indigo-600 uppercase">
              Vision.
            </h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xs">OW</span>
          </div>
        </header>

        {/* Kartu Pendapatan (Gaya Dashboard Pelanggan) */}
        <div className="bg-indigo-600 text-white p-8 rounded-[3rem] shadow-2xl shadow-indigo-200 relative overflow-hidden mb-10">
          <div className="absolute -top-4 -right-4 opacity-10 select-none text-white">
            <span className="text-[8rem] font-black italic leading-none">Rp</span>
          </div>
          
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Total Omzet</p>
            <h2 className="text-3xl font-black tracking-tighter mb-8">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPendapatan._sum.jumlah || 0)}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-[9px] font-bold text-indigo-200 uppercase">Okupansi</p>
                <p className="text-sm font-black uppercase tracking-tight">{kamarTerisi} Kamar Terisi</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-indigo-200 uppercase">Laporan Masuk</p>
                <p className="text-sm font-black uppercase">{totalLaporan} Tiket</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Navigasi Pemilik */}
        <div className="grid grid-cols-1 gap-4 mb-10">
           
           {/* Tombol Laporan Pembayaran (Besar) */}
           <Link 
             href="/dashboard/pemilik/keuangan"
             className="bg-gray-50 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 shadow-sm"
           >
              <div className="flex items-center gap-6">
                <div className="text-4xl bg-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  📊
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Financial</p>
                  <h3 className="text-lg font-black italic tracking-tighter text-gray-900 uppercase">Laporan Pembayaran</h3>
                </div>
              </div>
              <span className="text-2xl text-gray-300 group-hover:text-indigo-600">→</span>
           </Link>

           {/* Tombol Kehadiran Petugas (Besar) */}
           <Link 
             href="/dashboard/pemilik/kehadiran"
             className="bg-gray-50 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100 shadow-sm"
           >
              <div className="flex items-center gap-6">
                <div className="text-4xl bg-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  👤
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Attendance</p>
                  <h3 className="text-lg font-black italic tracking-tighter text-gray-900 uppercase">Kehadiran Petugas</h3>
                </div>
              </div>
              <span className="text-2xl text-gray-300 group-hover:text-emerald-600">→</span>
           </Link>
        </div>

        {/* Footer & Logout */}
        <div className="flex flex-col items-center border-t border-gray-100 pt-10 gap-6">
            <TombolLogoutAdmin />
            <Link 
              href="/" 
              className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] hover:text-black transition-colors"
            >
              ← Beranda Utama
            </Link>
        </div>
      </div>
    </div>
  )
}