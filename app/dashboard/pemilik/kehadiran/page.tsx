import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function KehadiranPetugasPage() {
  const session = await auth()
  if (session?.user?.role !== "PEMILIK") redirect("/")

  const daftarAbsensi = await prisma.absensi.findMany({
    include: { user: { select: { nama: true } } },
    orderBy: { tanggal: 'desc' }
  })

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-4">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/pemilik" className="text-xl p-2 hover:bg-gray-100 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h1 className="text-xl font-black italic tracking-tighter text-gray-900 uppercase">Kehadiran Petugas</h1>
        </div>

        {/* Tab Navigasi Aktif */}
        <div className="flex border-b border-gray-100 mb-8">
          <Link href="/dashboard/pemilik/keuangan" className="flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-gray-500 text-center">
            Pembayaran
          </Link>
          <button className="flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 border-black">
            Kehadiran
          </button>
        </div>

        <div className="space-y-4">
          {daftarAbsensi.map((absen: any) => (
            <div key={absen.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group hover:bg-white hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">{absen.user?.nama}</h3>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                    {new Date(absen.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="absolute bottom-6 right-8">
                   <div className="bg-white px-5 py-2 rounded-xl text-[9px] font-black uppercase text-gray-900 border border-gray-100 shadow-sm">
                      {absen.status}
                   </div>
                </div>
              </div>
            </div>
          ))}
          {/* ... pesan jika kosong ... */}
        </div>
      </div>
    </div>
  )
}