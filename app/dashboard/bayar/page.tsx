import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import FormBayar from "./form-bayar"

export const dynamic = 'force-dynamic'

export default async function HalamanBayarPelanggan() {
  const session = await auth()
  if (!session) redirect("/")

  // Ambil data user, kamar, dan riwayat pembayaran sekaligus
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      kamar: true,
      pembayaran: {
        orderBy: { createdAt: 'desc' }, // Yang terbaru muncul di atas
        take: 5 // Tampilkan 5 transaksi terakhir saja agar tidak kepanjangan
      }
    }
  })

  if (!user?.kamar) redirect("/dashboard")

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(angka)
  }

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-4 pb-20">
        
        <Link href="/dashboard" className="text-gray-200 mb-8 block w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>

        <header className="mb-10">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Tagihan & Riwayat</p>
          <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase leading-none">Pembayaran.</h1>
        </header>

        {/* SECTION 1: FORM UPLOAD */}
        <div className="bg-gray-50 rounded-[3rem] p-8 border border-gray-100 mb-10">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-6">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tagihan Aktif</p>
             <span className="text-xl font-black italic text-gray-900">{formatRupiah(user.kamar.harga)}</span>
          </div>
          <FormBayar userId={user.id} jumlah={user.kamar.harga} />
        </div>

        {/* SECTION 2: RIWAYAT TRANSAKSI */}
        <div className="px-2">
          <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            Riwayat Transaksi
          </h2>

          <div className="space-y-4">
            {user.pembayaran.length === 0 ? (
              <p className="text-[10px] font-bold text-gray-300 uppercase italic text-center py-10 border-2 border-dashed border-gray-50 rounded-[2rem]">Belum ada riwayat pembayaran.</p>
            ) : (
              user.pembayaran.map((bayar) => (
                <div key={bayar.id} className="bg-white border border-gray-100 p-5 rounded-[2rem] flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-tighter mb-1">
                      {new Date(bayar.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[11px] font-bold text-indigo-600 italic">
                      {formatRupiah(bayar.jumlah)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      bayar.status === 'BERHASIL' ? 'bg-emerald-100 text-emerald-600' : 
                      bayar.status === 'GAGAL' ? 'bg-red-100 text-red-600' : 
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {bayar.status}
                    </span>
                    <p className="text-[8px] text-gray-300 font-bold uppercase mt-1.5 tracking-tighter">{bayar.metode}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}