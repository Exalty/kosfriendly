import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import { buatKomplain } from "./action" // Kita akan buat action ini di bawah

export default async function KomplainPelangganPage() {
  const session = await auth()
  if (!session) redirect("/login")

  // 1. Ambil data laporan khusus milik user yang sedang login saja
  const listKomplain = await prisma.komplain.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-10 pb-20">

        <header className="mb-10">
          <a href="/dashboard" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black">
            ← Dashboard
          </a>
          <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase mt-4">Lapor.</h1>
        </header>

        {/* FORM TAMBAH KOMPLAIN */}
        <div className="bg-gray-50 p-8 rounded-[2.5rem] mb-12 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Buat Laporan Baru</p>
          <form action={buatKomplain} className="space-y-6">
            <div>
              <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Subjek</label>
              <input
                name="subjek"
                placeholder="Misal: Air Keran Mati"
                className="w-full border-b-2 border-gray-200 py-3 bg-transparent font-bold focus:outline-none focus:border-black transition-all"
                required
              />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Deskripsi Masalah</label>
              <textarea
                name="deskripsi"
                placeholder="Jelaskan kendala kamu secara detail..."
                className="w-full bg-white rounded-2xl p-4 h-32 text-sm font-medium focus:outline-none border border-gray-100 mt-2"
                required
              />
            </div>
            <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              Kirim Laporan
            </button>
          </form>
        </div>

        {/* DAFTAR LAPORAN SAYA */}
        <div className="space-y-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Riwayat Laporan Kamu</p>
          {listKomplain.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-sm uppercase tracking-tight text-gray-900">{item.subjek}</h3>
                {/* STATUS HANYA UNTUK DILIHAT (TIDAK BISA DIUBAH) */}
                <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${item.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                    item.status === 'PROSES' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">{item.deskripsi}</p>
              <p className="text-[8px] font-bold text-gray-300 uppercase">{new Date(item.createdAt).toLocaleDateString('id-ID')}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}