import { auth, signOut } from "@/auth"
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
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans text-gray-900">
      <div className="max-w-md mx-auto pt-6">

        {/* HEADER */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Penghuni Kos</p>
            <h1 className="text-3xl font-black italic tracking-tight text-gray-950 uppercase leading-none mt-1">
              {user.nama?.split(' ')[0]}
            </h1>
          </div>

          <form action={async () => {
            'use server'
            await signOut()
          }}>
            <button 
              type="submit" 
              className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl hover:bg-gray-950 group transition-all shadow-sm"
            >
              <span className="text-xs font-bold text-gray-700 group-hover:text-white uppercase tracking-wider">Keluar</span>
            </button>
          </form>
        </header>

        {/* KARTU KAMAR ATAU BOOKING */}
        <div className="mb-8">
          {user.kamar ? (
            <div className="bg-gray-950 text-white p-7 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <span className="text-8xl font-black italic leading-none">{user.kamar.nomorKamar}</span>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Kamar Aktif Anda</p>
              <h2 className="text-5xl font-black tracking-tight mb-6 leading-none">Kamar {user.kamar.nomorKamar}</h2>
              <div className="flex justify-between items-center border-t border-white/15 pt-5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tipe Kamar</span>
                <span className="text-sm font-black uppercase text-white">{user.kamar.tipe}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-300 p-8 rounded-[2.5rem] text-center flex flex-col items-center justify-center min-h-[260px] shadow-sm">
              <div className="text-5xl mb-3">🏠</div>
              <div className="mb-6">
                <p className="text-gray-900 text-base font-bold">Belum Ada Kamar Aktif</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Pilih kamar yang tersedia untuk mulai menyewa</p>
              </div>
              <Link
                href="/pilih-kamar"
                className="bg-gray-950 text-white px-6 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs shadow-md hover:bg-black active:scale-95 transition-all w-full text-center"
              >
                Pilih Kamar Sekarang →
              </Link>
            </div>
          )}
        </div>

        {/* GRID MENU NAVIGASI */}
        <div className="grid grid-cols-3 gap-3">
          <Link 
            href="/dashboard/bayar" 
            className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:shadow-md transition-all border border-gray-200 hover:border-gray-950 h-32"
          >
            <span className="text-3xl transition-transform group-hover:scale-110">💳</span>
            <span className="text-xs font-bold uppercase text-gray-800 group-hover:text-black tracking-normal text-center leading-tight">
              Bayar<br />Sewa
            </span>
          </Link>

          <Link 
            href="/dashboard/komplain" 
            className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:shadow-md transition-all border border-gray-200 hover:border-gray-950 h-32"
          >
            <span className="text-3xl transition-transform group-hover:scale-110">🛠️</span>
            <span className="text-xs font-bold uppercase text-gray-800 group-hover:text-black tracking-normal text-center leading-tight">
              Lapor<br />Keluhan
            </span>
          </Link>

          <Link
            href="/dashboard/checkout"
            className={`p-5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border h-32 ${
              !user.kamar
                ? 'opacity-40 pointer-events-none bg-gray-100 border-gray-200'
                : 'bg-white border-gray-200 group hover:border-rose-500 hover:shadow-md'
            }`}
          >
            <span className="text-3xl transition-transform group-hover:scale-110">🚪</span>
            <span className={`text-xs font-bold uppercase tracking-normal text-center leading-tight ${
              !user.kamar ? 'text-gray-400' : 'text-gray-800 group-hover:text-rose-600'
            }`}>
              Check<br />Out
            </span>
          </Link>
        </div>

      </div>
    </div>
  )
}
