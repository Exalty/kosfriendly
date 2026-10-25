import { prisma } from "../../lib/prisma"
import Link from "next/link"
import FooterPublic from "@/components/FooterPublic"

export default async function DetailKamarPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  
  const kamar = await prisma.kamar.findUnique({
    where: { id: params.id }
  })

  if (!kamar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-gray-900">
        <h2 className="text-xl font-bold mb-2">Kamar tidak ditemukan</h2>
        <Link href="/pilih-kamar" className="text-sm font-semibold text-blue-600 hover:underline">
          ← Kembali ke daftar kamar
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header Visual */}
      <div className="w-full h-72 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative flex flex-col justify-between p-6">
        <Link 
          href={`/pilih-kamar?tipe=${kamar.tipe}`}
          className="self-start bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm font-bold text-xs uppercase tracking-wider text-white transition-all"
        >
          ← Kembali
        </Link>
        <div className="flex flex-col items-center justify-center pb-8 text-center">
          <span className="text-5xl mb-2">🛏️</span>
          <p className="text-xs uppercase font-bold tracking-widest text-gray-300">
            Kamar {kamar.nomorKamar} • Tipe {kamar.tipe}
          </p>
        </div>
      </div>

      {/* Info Utama */}
      <div className="px-6 -mt-8 bg-white rounded-t-[2.5rem] relative z-10 pt-8 flex-1 border-t border-gray-200 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Tipe {kamar.tipe}
            </span>
            <h1 className="text-3xl font-black text-gray-950 mt-2 uppercase tracking-tight">
              Kamar {kamar.nomorKamar}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Harga Sewa</p>
            <p className="text-2xl font-black text-blue-600">Rp {kamar.harga.toLocaleString('id-ID')}</p>
            <p className="text-xs text-gray-500 font-semibold">per bulan</p>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Deskripsi & Fasilitas */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
            Fasilitas Kamar
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
              {kamar.fasilitas || "Fasilitas standar lengkap untuk kenyamanan penghuni."}
            </p>
          </div>
        </div>

        {/* Tombol Booking */}
        <Link
          href={`/register?kamarId=${kamar.id}`}
          className="block w-full bg-gray-950 text-white text-center py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl hover:bg-black transition active:scale-95 mb-8"
        >
          Booking Kamar Ini Sekarang →
        </Link>
      </div>

      <FooterPublic />
    </div>
  )
}
