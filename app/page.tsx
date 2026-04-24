import Link from 'next/link'
import { prisma } from '../app/lib/prisma'
import FooterPublic from '@/components/FooterPublic'

export default async function BerandaPage() {
  // Kita ambil daftar tipe yang unik dan harga terendah untuk tiap tipe
  // supaya "Mulai dari Rp..." selalu akurat
  const daftarTipe = await prisma.kamar.findMany({
    select: {
      tipe: true,
      harga: true,
    },
    orderBy: {
      harga: 'asc', // Urutkan dari yang termurah
    },
  })

  // Filter agar hanya ada satu entri per tipe di tampilan
  const unikTipe = Array.from(new Set(daftarTipe.map(k => k.tipe)))
    .map(tipe => daftarTipe.find(k => k.tipe === tipe))

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">

      {/* Banner - First Impression */}
      <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-200 to-white">
        <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 mb-2">KOSFRIENDLY.</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Temukan Kamar Impianmu</p>
      </div>

      {/* Konten Utama */}
      <div className="w-full max-w-lg mx-auto px-6 -mt-10 relative z-10">
        <div className="flex flex-col gap-4 py-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Pilih Tipe Hunian</p>
          
          {unikTipe.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2.5rem] py-12 text-center italic text-gray-400 text-xs">
              Belum ada tipe kamar yang tersedia.
            </div>
          ) : (
            unikTipe.map((kamar) => (
              <Link
                key={kamar?.tipe}
                href={`/pilih-kamar?tipe=${kamar?.tipe}`}
                className="group w-full py-7 px-6 bg-gray-50 border border-gray-100 rounded-[2.5rem] flex justify-between items-center hover:bg-black transition-all duration-300 shadow-sm active:scale-95"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-black text-gray-800 group-hover:text-white transition-colors uppercase tracking-tighter">
                    {kamar?.tipe}
                  </span>
                  <p className="text-[10px] text-gray-400 group-hover:text-gray-300 font-bold uppercase tracking-tighter mt-1">
                    Lihat Ketersediaan • Mulai Rp {kamar?.harga.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-2xl group-hover:bg-gray-800 transition-colors shadow-sm">
                  <span className="text-gray-400 group-hover:text-white">→</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pb-10 mt-4">
          <Link
            href="/login"
            className="flex-1 py-5 bg-black text-white rounded-[2rem] text-[10px] text-center font-black uppercase tracking-[0.2em] shadow-xl hover:bg-gray-800 transition active:scale-95"
          >
            Masuk Akun
          </Link>
        </div>
      </div>

      <div className="flex-1" />

      {/* Footer Navigasi (WhatsApp, Lokasi, Email) */}
      <FooterPublic />

    </div>
  )
}