import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function TugasPerbaikanPage() {
  const session = await auth()
  if (session?.user?.role !== "PETUGAS") redirect("/")

  const daftarTugas = await prisma.komplain.findMany({
    where: {
      status: { in: ['PENDING', 'PROSES'] }
    },
    include: {
      user: {
        include: { 
          // Pastikan nama relasi di schema.prisma adalah 'kamar'
          kamar: true 
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-white p-6 font-sans pb-24">
      <div className="max-w-md mx-auto pt-4">
        
        <div className="flex items-center gap-6 mb-10">
          <Link href="/dashboard/petugas" className="text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h1 className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase">Task List.</h1>
        </div>

        <div className="space-y-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Tugas Aktif ({daftarTugas.length})</p>

          {daftarTugas.map((tugas: any) => (
            <div key={tugas.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    tugas.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {tugas.status}
                  </span>
                  <h3 className="text-lg font-black italic uppercase tracking-tighter text-gray-900 mt-3 leading-tight">
                    {tugas.subjek}
                  </h3>
                </div>
                {/* PERBAIKAN ROOM: Menampilkan nomor kamar dari relasi user */}
                <div className="text-right bg-white p-3 rounded-2xl shadow-sm border border-gray-50 min-w-[70px]">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Room</p>
                  <p className="text-lg font-black italic text-indigo-600 leading-none">
                    {tugas.user?.kamar?.nomorKamar || "N/A"}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8">
                "{tugas.deskripsi}"
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
                <div className="flex flex-col">
                   <p className="text-[9px] font-bold text-gray-400 uppercase">Pelapor</p>
                   <p className="text-[10px] font-black text-gray-800 uppercase">{tugas.user?.nama}</p>
                </div>
                
                {/* PERBAIKAN TOMBOL: Link ke halaman detail untuk update status */}
                <Link 
                  href={`/dashboard/petugas/komplain/${tugas.id}`}
                  className="bg-[#0f172a] text-white px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                >
                  Proses Task →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}