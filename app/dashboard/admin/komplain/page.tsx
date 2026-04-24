import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma" // Gunakan @ agar tidak pusing hitung titik
import { redirect } from "next/navigation"
import StatusAction from "@/components/StatusAction"

export default async function KomplainPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/")

  const listKomplain = await prisma.komplain.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  })

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-10">
        
        {/* Tombol Back ke Admin Dashboard */}
        <div className="mb-6">
          <a href="/dashboard/admin" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black">
            ← Dashboard
          </a>
        </div>

        <header className="mb-10">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">User Feedback</p>
          <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase">Laporan.</h1>
        </header>

        <div className="flex flex-col gap-6">
          {listKomplain.map((item: any) => (
            <div key={item.id} className="bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                    {item.user?.nama || 'Anonim'}
                  </span>
                  <span className="text-[8px] font-bold text-blue-500 uppercase mt-1">
                    Subjek: {item.subjek}
                  </span>
                </div>
                {/* Indikator Status Visual */}
                <div className={`w-3 h-3 rounded-full shadow-sm ${
                  item.status === 'PENDING' ? 'bg-orange-500' : 
                  item.status === 'PROSES' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
              </div>

              <p className="text-gray-900 text-sm font-bold leading-relaxed mb-3 bg-white/50 p-4 rounded-2xl border border-gray-100">
                "{item.deskripsi}"
              </p>
              
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-4 ml-1">
                Diterima: {new Date(item.createdAt).toLocaleDateString('id-ID')}
              </p>

              {/* Komponen interaksi untuk ubah status */}
              <StatusAction id={item.id} statusSaatIni={item.status} />
            </div>
          ))}

          {listKomplain.length === 0 && (
            <div className="text-center py-20 italic text-gray-300 text-xs">
              Belum ada laporan dari penghuni.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}