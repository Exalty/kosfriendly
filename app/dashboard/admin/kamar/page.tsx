import { prisma } from "../../../lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import TombolHapus from "./TombolHapus"

export default async function KamarPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/dashboard")

  const semuaKamar = await prisma.kamar.findMany({
    orderBy: { nomorKamar: 'asc' }
  })

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen pb-24 text-gray-900 font-sans">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/dashboard/admin" className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider">
              ← Control Panel
            </Link>
            <h2 className="text-2xl font-black text-gray-950 mt-1">Manajemen Kamar</h2>
          </div>
          <Link 
            href="/dashboard/admin/kamar/tambah"
            className="bg-gray-950 text-white text-xs px-4 py-2.5 rounded-2xl font-bold uppercase tracking-wider hover:bg-black transition-all shadow-sm"
          >
            + Tambah
          </Link>
        </div>

        <div className="grid gap-4">
          {semuaKamar.map((kamar) => (
            <div key={kamar.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
              {/* Label Tipe di Pojok */}
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3.5 py-1 rounded-bl-xl font-bold uppercase tracking-wider">
                {kamar.tipe}
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor Kamar</p>
                <h3 className="text-2xl font-black text-gray-950 mt-0.5">{kamar.nomorKamar}</h3>
              </div>

              <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Harga / Bulan</p>
                  <p className="font-bold text-blue-600 text-base">Rp {kamar.harga.toLocaleString('id-ID')}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/dashboard/admin/kamar/edit/${kamar.id}`}
                    className="px-3.5 py-2 bg-gray-100 text-xs font-bold text-gray-800 rounded-xl uppercase hover:bg-gray-950 hover:text-white transition-all border border-gray-200"
                  >
                    Edit
                  </Link>
                  <TombolHapus id={kamar.id} nomor={kamar.nomorKamar} />
                </div>
              </div>
            </div>
          ))}

          {semuaKamar.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-sm font-semibold">Belum ada kamar terdaftar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
