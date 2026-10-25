import { prisma } from "../lib/prisma"
import Link from "next/link"
import FooterPublic from "@/components/FooterPublic"

export default async function PilihKamarPage({
  searchParams,
}: {
  searchParams: Promise<{ tipe?: string }>
}) {
  const { tipe: tipeTerpilih } = await searchParams

  const semuaTipe = await prisma.kamar.findMany({
    select: { tipe: true },
    distinct: ['tipe'],
  })

  const queryFilter = tipeTerpilih ? { tipe: tipeTerpilih } : {}

  const daftarKamar = await prisma.kamar.findMany({
    where: queryFilter,
    include: { penghuni: true },
    orderBy: { nomorKamar: 'asc' }
  })

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-gray-900">
      
      {/* Header */}
      <div className="px-6 pt-10">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 uppercase tracking-wider hover:text-black transition-colors">
          ← Kembali ke Beranda
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight text-gray-950 mt-3 uppercase">
          {tipeTerpilih ? `Tipe ${tipeTerpilih}` : "Daftar Semua Kamar"}
        </h1>
        <p className="text-xs font-medium text-gray-600 mt-1">
          Pilih unit kamar yang masih tersedia di bawah ini
        </p>
      </div>

      {/* Tab Sortir */}
      <div className="px-6 mt-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max pb-2">
          {/* Tombol ALL */}
          <Link
            href="/pilih-kamar"
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              !tipeTerpilih 
              ? "bg-gray-950 text-white shadow-md scale-105" 
              : "bg-white text-gray-700 border border-gray-300 hover:border-gray-900"
            }`}
          >
            Semua Tipe
          </Link>

          {/* Tombol Tipe Lainnya */}
          {semuaTipe.map((t) => (
            <Link
              key={t.tipe}
              href={`/pilih-kamar?tipe=${t.tipe}`}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                tipeTerpilih === t.tipe 
                ? "bg-gray-950 text-white shadow-md scale-105" 
                : "bg-white text-gray-700 border border-gray-300 hover:border-gray-900"
              }`}
            >
              {t.tipe}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid Kamar */}
      <div className="flex-1 px-6 pb-24 mt-6">
        {daftarKamar.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-[2rem] p-12 text-center text-gray-600 text-sm font-semibold">
            Tidak ada kamar yang sesuai filter ini.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {daftarKamar.map((kamar) => {
              const isPenuh = kamar.penghuni.length > 0

              return isPenuh ? (
                <div 
                  key={kamar.id} 
                  className="bg-gray-100 border border-gray-300 p-6 pt-9 rounded-[2rem] flex flex-col items-center justify-center relative shadow-inner"
                >
                  <div className="absolute top-0 right-0 bg-rose-600 text-white text-[11px] px-3.5 py-1 rounded-bl-xl font-bold uppercase tracking-wider">
                    Terisi
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kamar</span>
                  <h3 className="text-3xl font-black text-gray-500">{kamar.nomorKamar}</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-2">
                    {kamar.tipe}
                  </p>
                </div>
              ) : (
                <Link
                  key={kamar.id}
                  href={`/pilih-kamar/${kamar.id}`}
                  className="bg-white border-2 border-gray-200 p-6 pt-9 rounded-[2rem] flex flex-col items-center justify-center hover:border-gray-950 transition-all active:scale-95 group shadow-sm hover:shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] px-3.5 py-1 rounded-bl-xl font-bold uppercase tracking-wider shadow-sm">
                    Tersedia
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kamar</span>
                  <h3 className="text-3xl font-black text-gray-950 group-hover:scale-105 transition-transform">
                    {kamar.nomorKamar}
                  </h3>
                  <p className="text-sm font-bold text-blue-600 mt-2">
                    Rp {kamar.harga.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs font-bold text-gray-600 uppercase mt-1">
                    {kamar.tipe}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <FooterPublic />
    </div>
  )
}
