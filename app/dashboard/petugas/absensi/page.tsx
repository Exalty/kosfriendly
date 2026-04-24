import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import TombolAbsen from "@/components/TombolAbsen"

export default async function AbsensiPetugasPage() {
    const session = await auth()
    if (session?.user?.role !== "PETUGAS") redirect("/")

    // Cek apakah sudah absen hari ini
    const hariIni = new Date()
    hariIni.setHours(0, 0, 0, 0)

    const absenHariIni = await prisma.absensi.findFirst({
        where: {
            userId: session.user.id,
            tanggal: { gte: hariIni }
        }
    })

    return (
        <div className="min-h-screen bg-white p-6 font-sans">
            <div className="max-w-md mx-auto pt-4">

                <div className="flex items-center gap-4 mb-10">
                    <Link href="/dashboard/petugas" className="text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h1 className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase">Presence</h1>
                </div>

                <div className="bg-emerald-50 rounded-[3rem] p-10 border border-emerald-100 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        {absenHariIni ? (
                            <>
                                <div className="text-5xl mb-6">✨</div>
                                <h2 className="text-xl font-black uppercase italic tracking-tighter text-emerald-900">Sudah Presensi</h2>
                                <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest mt-2">
                                    Masuk jam: {new Date(absenHariIni.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <div className="mt-8 pt-8 border-t border-emerald-200/50">
                                    <p className="text-[9px] font-black text-emerald-700 uppercase tracking-[0.3em]">Selamat Bekerja!</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-5xl mb-6 animate-bounce">📍</div>
                                <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-900">Lapor Lokasi</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 mb-10 px-4">
                                    Ketuk tombol di bawah jika kamu sudah sampai di area kos.
                                </p>
                                <TombolAbsen />
                            </>
                        )}
                    </div>
                    <div className="absolute -bottom-10 -right-10 text-[10rem] font-black italic text-emerald-100/50 select-none">OK</div>
                </div>

            </div>
        </div>
    )
}