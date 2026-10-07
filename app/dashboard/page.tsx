import { auth, signOut } from "@/auth" // Kita ambil signOut langsung dari auth
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { kamar: true }
  })

  if (!user) redirect("/login")
  if (user.role === "ADMIN") redirect("/dashboard/admin")
  if (user.role === "PETUGAS") redirect("/dashboard/petugas")

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-10">

        {/* HEADER */}
        <header className="flex justify-between items-start mb-10">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Penghuni</p>
            <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase leading-none">
              {user.nama?.split(' ')[0]}
            </h1>
          </div>

          {/* Form Logout Sederhana tanpa perlu komponen tambahan */}
          <form action={async () => {
            'use server'
            await signOut()
          }}>
            <button type="submit" className="bg-gray-100 px-5 py-3 rounded-2xl hover:bg-black group transition-all">
              <span className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase tracking-widest">Exit</span>
            </button>
          </form>
        </header>

        {/* KARTU KAMAR ATAU BOOKING */}
        <div className="mb-10">
          {user.kamar ? (
            <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <span className="text-8xl font-black italic leading-none">{user.kamar.nomorKamar}</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kamar Kamu</p>
              <h2 className="text-6xl font-black tracking-tighter mb-8 leading-none">{user.kamar.nomorKamar}</h2>
              <div className="flex justify-between items-center border-t border-white/10 pt-6">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipe Unit</span>
                <span className="text-sm font-black uppercase italic">{user.kamar.tipe}</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-12 rounded-[2.5rem] text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="text-5xl mb-4">🏠</div>
              <div className="mb-8">
                <p className="text-gray-900 text-sm font-black uppercase italic">Belum ada kamar aktif.</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Silakan pilih unit tersedia</p>
              </div>
              <Link
                href="/dashboard/booking"
                className="bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 active:scale-95 transition-all w-full text-center"
              >
                Cari Kamar Sekarang
              </Link>
            </div>
          )}
        </div>

        {/* GRID MENU NAVIGASI */}
        <div className="grid grid-cols-3 gap-4">
          <Link href="/dashboard/bayar" className="bg-gray-50 p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 h-32">
            <span className="text-2xl transition-transform group-hover:scale-110">💳</span>
            <span className="text-[8px] font-black uppercase text-gray-400 group-hover:text-black tracking-widest text-center leading-tight">Bayar<br />Kos</span>
          </Link>

          <Link href="/dashboard/komplain" className="bg-gray-50 p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 h-32">
            <span className="text-2xl transition-transform group-hover:scale-110">🛠️</span>
            <span className="text-[8px] font-black uppercase text-gray-400 group-hover:text-black tracking-widest text-center leading-tight">Lapor<br />Masalah</span>
          </Link>

          <Link
            href="/dashboard/checkout"
            className={`p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all border border-transparent h-32 ${!user.kamar
                ? 'opacity-20 pointer-events-none' // Mati jika tidak punya kamar
                : 'bg-red-50/50 group hover:bg-red-500 hover:shadow-xl hover:shadow-red-100'
              }`}
          >
            <span className="text-2xl transition-transform group-hover:scale-110 group-hover:brightness-200">🚪</span>
            <span className={`text-[8px] font-black uppercase tracking-widest text-center leading-tight ${!user.kamar ? 'text-gray-400' : 'text-red-400 group-hover:text-white'
              }`}>
              Check<br />Out
            </span>
          </Link>
        </div>

      </div>
    </div>
  )
}