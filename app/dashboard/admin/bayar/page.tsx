import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Image from "next/image"

export default async function AdminBayarPage() {
  const session = await auth()
  
  // 1. Proteksi Role
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "PEMILIK")) {
    redirect("/dashboard")
  }

  // 2. Ambil Data Pembayaran
  const semuaPembayaran = await prisma.pembayaran.findMany({
    include: { 
      user: {
        include: { kamar: true }
      } 
    },
    orderBy: { createdAt: 'desc' }
  })

  // 3. Server Action untuk Update Status (Fungsi di sisi server)
  async function konfirmasiBayar(formData: FormData) {
    'use server'
    const id = formData.get("id") as string
    const status = formData.get("status") as "BERHASIL" | "GAGAL"

    await prisma.pembayaran.update({
      where: { id },
      data: { status }
    })

    revalidatePath("/dashboard/admin/bayar")
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">Finance Control</p>
          <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase leading-none">Verifikasi Bayar.</h1>
        </header>

        <div className="grid gap-6">
          {semuaPembayaran.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
               <p className="text-[10px] font-black text-gray-300 uppercase italic">Belum ada data pembayaran.</p>
            </div>
          ) : (
            semuaPembayaran.map((bayar) => (
              <div key={bayar.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                {/* Header Kartu */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">
                      Kamar {bayar.user.kamar?.nomorKamar || "N/A"}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 mt-2">{bayar.user.nama}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{bayar.metode} • {new Date(bayar.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Jumlah</p>
                    <p className="text-lg font-black italic text-gray-900 tracking-tighter">
                      Rp {bayar.jumlah.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Preview Bukti Bayar */}
                {bayar.buktiBayar ? (
                  <div className="mb-6 group relative">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-3 ml-1">Bukti Transfer:</p>
                    <div className="relative h-64 w-full overflow-hidden rounded-[2rem] border border-gray-100 bg-gray-50">
                      <img 
                        src={bayar.buktiBayar} 
                        alt="Bukti Transfer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <a 
                        href={`/uploads/${bayar.buktiBayar}`} 
                        target="_blank"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span className="text-[10px] font-black text-white uppercase tracking-widest border border-white/50 px-4 py-2 rounded-full">Lihat Full Foto</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-6 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-[10px] font-bold text-red-500 uppercase text-center italic tracking-widest">⚠️ Tidak ada bukti foto</p>
                  </div>
                )}

                {/* Status & Action */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <span className={`text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-widest ${
                    bayar.status === 'BERHASIL' ? 'bg-emerald-100 text-emerald-600' : 
                    bayar.status === 'GAGAL' ? 'bg-red-100 text-red-600' : 
                    'bg-orange-100 text-orange-600 animate-pulse'
                  }`}>
                    {bayar.status}
                  </span>

                  {bayar.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <form action={konfirmasiBayar}>
                        <input type="hidden" name="id" value={bayar.id} />
                        <input type="hidden" name="status" value="GAGAL" />
                        <button className="px-5 py-3 rounded-2xl border-2 border-red-100 text-red-600 text-[10px] font-black uppercase hover:bg-red-50 transition-all">
                          Tolak
                        </button>
                      </form>

                      <form action={konfirmasiBayar}>
                        <input type="hidden" name="id" value={bayar.id} />
                        <input type="hidden" name="status" value="BERHASIL" />
                        <button className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                          Konfirmasi
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}