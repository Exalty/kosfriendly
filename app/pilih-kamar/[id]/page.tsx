import { prisma } from "../../lib/prisma"
import Link from "next/link"
import FooterPublic from "@/components/FooterPublic"

export default async function DetailKamarPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  
  const kamar = await prisma.kamar.findUnique({
    where: { id: params.id }
  })

  if (!kamar) return <div className="p-10">Kamar tidak ditemukan</div>

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Gambar / Header Visual */}
      <div className="w-full h-80 bg-gray-100 relative">
        <Link 
          href={`/pilih-kamar?tipe=${kamar.tipe}`}
          className="absolute top-10 left-6 z-10 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm font-bold text-[10px] uppercase"
        >
          ← Kembali
        </Link>
        <div className="w-full h-full flex items-center justify-center text-gray-300 italic">
          [ Area Foto Kamar {kamar.nomorKamar} ]
        </div>
      </div>

      {/* Info Utama */}
      <div className="px-8 -mt-10 bg-white rounded-t-[3rem] relative z-10 pt-10 flex-1">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Tipe {kamar.tipe}
            </span>
            <h1 className="text-4xl font-black text-gray-900 mt-2 uppercase tracking-tighter">
              Kamar {kamar.nomorKamar}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Harga Sewa</p>
            <p className="text-xl font-black text-gray-900">Rp {kamar.harga.toLocaleString('id-ID')}</p>
            <p className="text-[10px] text-gray-400 font-medium">/ bulan</p>
          </div>
        </div>

        <hr className="border-gray-50 mb-8" />

        {/* Deskripsi & Fasilitas */}
        <div className="mb-10">
          <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-4">Fasilitas Kamar</h3>
          <div className="bg-gray-50 rounded-[2rem] p-6">
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {kamar.fasilitas || "Fasilitas standar lengkap untuk kenyamanan penghuni."}
            </p>
          </div>
        </div>

        {/* Tombol Booking - Baru di sini diarahkan ke Register */}
        <Link
          href={`/register?kamarId=${kamar.id}`}
          className="block w-full bg-black text-white text-center py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-800 transition active:scale-95 mb-10"
        >
          Booking Sekarang
        </Link>
      </div>

      <FooterPublic />
    </div>
  )
}