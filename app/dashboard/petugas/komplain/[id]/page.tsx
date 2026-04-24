import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import { StatusKomplain } from "@prisma/client"

// 1. Definisikan tipe params sebagai Promise
export default async function DetailTugasPetugas({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  
  // 2. WAJIB: Await params-nya dulu di baris pertama
  const { id } = await params;

  const session = await auth()
  if (session?.user?.role !== "PETUGAS") redirect("/")

  // 3. Gunakan 'id' yang sudah di-await
  const tugas = await prisma.komplain.findUnique({
    where: { id: id },
    include: {
      user: { include: { kamar: true } }
    }
  })

  if (!tugas) redirect("/dashboard/petugas/komplain")

  // 4. Server Action (Berada di dalam komponen atau file terpisah)
  async function updateStatus(formData: FormData) {
    'use server'
    const statusBaru = formData.get("status") as StatusKomplain
    
    await prisma.komplain.update({
      // Gunakan 'id' dari hasil await di atas
      where: { id: id }, 
      data: { status: statusBaru }
    })

    revalidatePath("/dashboard/petugas/komplain")
    revalidatePath(`/dashboard/petugas/komplain/${id}`)
    
    if (statusBaru === "SELESAI") {
        redirect("/dashboard/petugas/komplain")
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-4">
        
        {/* Tombol Back */}
        <Link href="/dashboard/petugas/komplain" className="text-gray-200 mb-8 block w-fit hover:text-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>

        {/* Status & Judul */}
        <div className="mb-10">
          <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] ${
            tugas.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 
            tugas.status === 'PROSES' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            {tugas.status}
          </span>
          <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase mt-4 leading-tight">
            {tugas.subjek}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Kamar {tugas.user?.kamar?.nomorKamar || "N/A"} — {tugas.user?.nama}
            </p>
          </div>
        </div>

        {/* Deskripsi Box */}
        <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 mb-10">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Deskripsi Masalah:</p>
          <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
            "{tugas.deskripsi}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {tugas.status === "PENDING" && (
            <form action={updateStatus}>
              <input type="hidden" name="status" value="PROSES" />
              <button className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-100 active:scale-95 transition-all">
                Mulai Kerjakan Sekarang →
              </button>
            </form>
          )}

          {tugas.status === "PROSES" && (
            <form action={updateStatus}>
              <input type="hidden" name="status" value="SELESAI" />
              <button className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-100 active:scale-95 transition-all">
                Tandai Sudah Selesai ✅
              </button>
            </form>
          )}

          {tugas.status === "SELESAI" && (
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] text-center">
               <div className="text-3xl mb-2">🎉</div>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-loose">Tugas ini telah diselesaikan</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}