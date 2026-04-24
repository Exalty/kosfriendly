import { prisma } from "../lib/prisma"
import Link from "next/link"
import FooterPublic from "@/components/FooterPublic"

export default async function PilihKamarPage({
  searchParams,
}: {
  searchParams: Promise<{ tipe?: string }> // Tambahkan tanda tanya karena tipe bisa kosong (All)
}) {
  // 1. Unwrapping searchParams (Next.js 15)
  const { tipe: tipeTerpilih } = await searchParams

  // 2. Ambil semua tipe unik untuk tombol sortir
  const semuaTipe = await prisma.kamar.findMany({
    select: { tipe: true },
    distinct: ['tipe'],
  })

  // 3. Logika Filter: Jika tipeTerpilih ada, filter berdasarkan tipe. Jika tidak (All), ambil semua.
  const queryFilter = tipeTerpilih ? { tipe: tipeTerpilih } : {}

  const daftarKamar = await prisma.kamar.findMany({
    where: queryFilter,
    include: { penghuni: true },
    orderBy: { nomorKamar: 'asc' }
  })

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* Header */}
      <div className="px-6 pt-12">
        <Link href="/" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black">
          ← Kembali
        </Link>
        <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 mt-4 uppercase">
          {tipeTerpilih ? `Tipe ${tipeTerpilih}` : "Semua Kamar"}
        </h1>
      </div>

      {/* Tab Sortir */}
      <div className="px-6 mt-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max pb-4">
          {/* Tombol ALL */}
          <Link
            href="/pilih-kamar" // Tanpa query string berarti menampilkan semua
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              !tipeTerpilih 
              ? "bg-black text-white shadow-lg scale-105" 
              : "bg-gray-50 text-gray-400 border border-gray-100"
            }`}
          >
            All
          </Link>

          {/* Tombol Tipe Lainnya */}
          {semuaTipe.map((t) => (
            <Link
              key={t.tipe}
              href={`/pilih-kamar?tipe=${t.tipe}`}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                tipeTerpilih === t.tipe 
                ? "bg-black text-white shadow-lg scale-105" 
                : "bg-gray-50 text-gray-400 border border-gray-100"
              }`}
            >
              {t.tipe}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid Kamar */}
      <div className="flex-1 px-6 pb-24 mt-4">
        <div className="grid grid-cols-2 gap-4">
          {daftarKamar.map((kamar) => {
            const isPenuh = kamar.penghuni.length > 0

            return isPenuh ? (
              <div key={kamar.id} className="bg-gray-50 border border-gray-100 p-8 pt-10 rounded-[2rem] flex flex-col items-center justify-center opacity-40 grayscale relative">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">FULL</span>
                <h3 className="text-2xl font-black text-gray-300">{kamar.nomorKamar}</h3>
                {/* Info tipe tambahan jika di mode ALL */}
                {!tipeTerpilih && <p className="text-[7px] font-bold text-gray-300 uppercase mt-1">{kamar.tipe}</p>}
              </div>
            ) : (
              <Link
                key={kamar.id}
                href={`/pilih-kamar/${kamar.id}`}
                className="bg-white border-2 border-gray-100 p-8 pt-10 rounded-[2rem] flex flex-col items-center justify-center hover:border-black transition-all active:scale-95 group shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-green-500 text-white text-[7px] px-4 py-1.5 rounded-bl-xl font-bold uppercase tracking-wider">
                  Kosong
                </div>
                <h3 className="text-3xl font-black text-gray-900 group-hover:scale-110 transition-transform">{kamar.nomorKamar}</h3>
                <p className="text-[10px] font-bold text-blue-500 mt-2 italic">Rp {kamar.harga.toLocaleString('id-ID')}</p>
                {/* Info tipe tambahan jika di mode ALL */}
                {!tipeTerpilih && <p className="text-[8px] font-black text-gray-400 uppercase mt-1 tracking-widest">{kamar.tipe}</p>}
              </Link>
            )
          })}
        </div>
      </div>

      <FooterPublic />
    </div>
  )
}