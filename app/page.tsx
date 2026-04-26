import Link from 'next/link'
import { prisma } from './lib/prisma'
import FooterPublic from '@/components/FooterPublic'

export const dynamic = 'force-dynamic'

export default async function BerandaPage() {
  let unikTipe: any[] = []

  try {
  const daftarTipe = await prisma.kamar.findMany({
    select: { tipe: true, harga: true },
  })
  
  // Memastikan data unik berdasarkan tipe (Reguler, Deluxe, Exclusive)
  unikTipe = Array.from(new Set(daftarTipe.map(k => k.tipe)))
    .map(tipe => daftarTipe.find(k => k.tipe === tipe))
} catch (error) {
  console.error("Database Error:", error)
}

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-200 to-white">
        <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 mb-2 uppercase">KOSFRIENDLY.</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Temukan Kamar Impianmu</p>
      </div>

      <div className="w-full max-w-lg mx-auto px-6 -mt-10 relative z-10">
        <div className="flex flex-col gap-4 py-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Pilih Tipe Hunian</p>

          {unikTipe.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2.5rem] py-12 text-center italic text-gray-400 text-xs font-bold uppercase tracking-widest">
              Gagal mengambil data atau kamar belum tersedia.
            </div>
          ) : (
            unikTipe.map((kamar) => (
              <Link
                key={kamar?.tipe}
                href={`/pilih-kamar?tipe=${kamar?.tipe}`}
                className="group w-full py-7 px-6 bg-gray-50 border border-gray-100 rounded-[2.5rem] flex justify-between items-center hover:bg-black transition-all shadow-sm"
              >
                <div className="flex flex-col text-left">
                  <span className="text-lg font-black text-gray-800 group-hover:text-white uppercase">
                    {kamar?.tipe || "Tipe Tidak Diketahui"}
                  </span>
                  <p className="text-[10px] text-gray-400 group-hover:text-gray-300 font-bold uppercase mt-1">
                    Mulai Rp {kamar?.harga?.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-2xl group-hover:bg-gray-800">
                  <span className="text-gray-400 group-hover:text-white font-bold">→</span>
                </div>
              </Link>
            ))
          )}
        </div>

        <Link href="/login" className="block w-full py-5 bg-black text-white rounded-[2rem] text-[10px] text-center font-black uppercase tracking-[0.2em] shadow-xl">
          Masuk Akun
        </Link>
      </div>
      <div className="flex-1" />
      <FooterPublic />
    </div>
  )
}