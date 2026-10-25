import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"

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
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans text-gray-900">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link href="/dashboard/admin" className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider mb-3 block">
            ← Control Panel
          </Link>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Finance Control</p>
          <h1 className="text-3xl font-black italic tracking-tight text-gray-950 uppercase leading-none">Verifikasi Pembayaran.</h1>
        </header>

        <div className="grid gap-6">
          {semuaPembayaran.length === 0 ? (
            <div className="bg-white p-16 rounded-[2.5rem] text-center border-2 border-dashed border-gray-200">
               <p className="text-sm font-semibold text-gray-400 italic">Belum ada data pembayaran masuk.</p>
            </div>
          ) : (
            semuaPembayaran.map((bayar) => (
              <div key={bayar.id} className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-200">
                {/* Header Kartu */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full uppercase tracking-wider">
                      Kamar {bayar.user.kamar?.nomorKamar || "Belum Ada"}
                    </span>
                    <h3 className="text-xl font-black text-gray-950 mt-2">{bayar.user.nama}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{bayar.metode} • {new Date(bayar.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Jumlah</p>
                    <p className="text-xl font-black text-blue-600 tracking-tight">
                      Rp {bayar.jumlah.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Preview Bukti Bayar */}
                {bayar.buktiBayar ? (
                  <div className="mb-6 group relative">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-2 ml-1">Foto Bukti Transfer:</p>
                    <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                      <img 
                        src={bayar.buktiBayar} 
                        alt="Bukti Transfer"
                        className="w-full h-full object-contain bg-black/5"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                    <p className="text-xs font-bold text-amber-700">⚠️ Tidak ada foto bukti yang dilampirkan</p>
                  </div>
                )}

                {/* Status & Action */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                  <span className={`text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider ${
                    bayar.status === 'BERHASIL' ? 'bg-emerald-100 text-emerald-800' : 
                    bayar.status === 'GAGAL' ? 'bg-rose-100 text-rose-800' : 
                    'bg-amber-100 text-amber-800'
                  }`}>
                    Status: {bayar.status}
                  </span>

                  {bayar.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <form action={konfirmasiBayar}>
                        <input type="hidden" name="id" value={bayar.id} />
                        <input type="hidden" name="status" value="GAGAL" />
                        <button className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 text-xs font-bold uppercase hover:bg-rose-50 transition-all cursor-pointer">
                          Tolak
                        </button>
                      </form>

                      <form action={konfirmasiBayar}>
                        <input type="hidden" name="id" value={bayar.id} />
                        <input type="hidden" name="status" value="BERHASIL" />
                        <button className="px-5 py-2 rounded-xl bg-gray-950 text-white text-xs font-bold uppercase hover:bg-black transition-all shadow-md cursor-pointer">
                          Verifikasi Lunas ✓
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
