import Link from 'next/link'
import { prisma } from './lib/prisma'
import FooterPublic from '@/components/FooterPublic'

export const dynamic = 'force-dynamic'

export default async function BerandaPage() {
  let unikTipe: any[] = []

  try {
    const daftarTipe = await prisma.kamar.findMany({
      select: { tipe: true, harga: true },
    });
    console.log("HASIL_DB:", JSON.stringify(daftarTipe));
    console.log("LOG: Data berhasil ditarik:", daftarTipe.length, "item ditemukan");

    unikTipe = Array.from(new Set(daftarTipe.map((k: any) => k.tipe)))
      .map(tipe => daftarTipe.find((k: any) => k.tipe === tipe));

    console.log("LOG: URL DB YANG DIPAKAI:", process.env.DATABASE_URL?.split('@')[1]);
  } catch (error: any) {
    console.error("LOG: ERROR DATABASE DETAIL:", error.message);
    console.error("LOG: ERROR CODE:", error.code);
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-gray-900">
      {/* Hero Header */}
      <div className="w-full h-64 bg-gradient-to-b from-gray-100 to-white border-b border-gray-200 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-gray-950 mb-2 uppercase">
          KOSFRIENDLY.
        </h1>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-[0.25em]">
          Temukan Kamar Impianmu
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto px-6 -mt-8 relative z-10">
        <div className="flex flex-col gap-4 py-4">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
            Pilih Tipe Hunian
          </p>

          {unikTipe.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-[2rem] py-12 px-6 text-center text-gray-600 text-sm font-semibold">
              Kamar belum tersedia atau sedang sinkronisasi data.
            </div>
          ) : (
            unikTipe.map((kamar) => (
              <Link
                key={kamar?.tipe}
                href={`/pilih-kamar?tipe=${kamar?.tipe}`}
                className="group w-full py-6 px-6 bg-white border border-gray-200 rounded-[2rem] flex justify-between items-center hover:bg-gray-950 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col text-left">
                  <span className="text-lg font-bold text-gray-900 group-hover:text-white uppercase tracking-tight">
                    Tipe {kamar?.tipe || "Reguler"}
                  </span>
                  <p className="text-xs text-gray-600 group-hover:text-gray-300 font-semibold mt-1">
                    Mulai Rp {kamar?.harga?.toLocaleString('id-ID')} / bulan
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl group-hover:bg-gray-800 transition-colors">
                  <span className="text-gray-700 group-hover:text-white font-bold text-base">→</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Tombol Aksi: Masuk Akun & Daftar Akun Pelanggan */}
        <div className="flex flex-col gap-3 mt-2">
          <Link 
            href="/login" 
            className="block w-full py-4 bg-gray-950 text-white rounded-[1.75rem] text-xs text-center font-bold uppercase tracking-widest shadow-md hover:bg-black active:scale-[0.99] transition-all"
          >
            Masuk Akun
          </Link>
          <Link 
            href="/register" 
            className="block w-full py-3.5 bg-white text-gray-950 border-2 border-gray-950 rounded-[1.75rem] text-xs text-center font-bold uppercase tracking-widest shadow-sm hover:bg-gray-100 active:scale-[0.99] transition-all"
          >
            + Daftar Akun Pelanggan Baru
          </Link>
        </div>
      </div>

      <div className="flex-1" />
      <FooterPublic />
    </div>
  )
}
