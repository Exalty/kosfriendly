import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import TombolPrint from "@/components/TombolPrint"

export default async function LaporanKeuanganPage() {
  const session = await auth()
  if (session?.user?.role !== "PEMILIK") redirect("/")

  const dataKamar = await prisma.kamar.findMany({
    orderBy: { nomorKamar: 'asc' },
    include: {
      penghuni: {
        include: {
          pembayaran: {
            where: { status: "BERHASIL" },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-4">
        
        {/* HEADER (Sesuai Gambar Kamu) */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <div className="flex items-center gap-6">
            <Link href="/dashboard/pemilik" className="text-gray-200">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h1 className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase">
              Laporan
            </h1>
          </div>
          
          <TombolPrint />
        </div>

        {/* TAB NAVIGASI (Biar bisa dipencet) */}
        <div className="flex border-b border-gray-100 mb-8 print:hidden">
          <button className="flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 border-black">
            Pembayaran
          </button>
          <Link href="/dashboard/pemilik/kehadiran" className="flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-300 text-center">
            Kehadiran
          </Link>
        </div>

        {/* FILTER BULAN (Input Lonjong sesuai gambar) */}
        <div className="mb-8 print:hidden">
            <div className="bg-gray-50 border border-gray-100 rounded-full px-6 py-4">
                <select className="w-full bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer">
                    <option>Januari 2026</option>
                    <option>Desember 2025</option>
                </select>
            </div>
        </div>

        {/* KONTEN TABEL (Ini yang hilang tadi) */}
        <div className="print:p-0">
          {/* Header khusus saat di-print (hidden di browser) */}
          <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
             <h1 className="text-xl font-black uppercase italic">Laporan Keuangan Kos</h1>
             <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Periode: Januari 2026</p>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="pb-4 font-black">No. Kamar</th>
                <th className="pb-4 text-center font-black">Tipe</th>
                <th className="pb-4 text-right font-black">Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dataKamar.map((kamar: any) => {
                const pembayaran = kamar.penghuni[0]?.pembayaran[0]?.jumlah || 0;
                return (
                  <tr key={kamar.id} className="text-[11px] font-bold text-gray-900 group">
                    <td className="py-5 uppercase font-black">{kamar.nomorKamar}</td>
                    <td className="py-5 text-center text-gray-400">{kamar.tipe}</td>
                    <td className="py-5 text-right font-black italic tracking-tighter">
                      {pembayaran > 0 
                        ? `Rp ${new Intl.NumberFormat('id-ID').format(pembayaran)}`
                        : <span className="text-gray-200 font-normal italic">Nihil</span>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {dataKamar.length === 0 && (
            <p className="text-center py-20 text-xs text-gray-300 italic">Data kamar tidak ditemukan.</p>
          )}
        </div>

      </div>
    </div>
  )
}