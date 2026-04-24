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
    <div className="p-6 bg-white min-h-screen pb-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-black text-gray-700">Manajemen Kamar</h2>
        <Link 
          href="/dashboard/admin/kamar/tambah"
          className="bg-black text-white text-[10px] px-4 py-2 rounded-full font-bold uppercase"
        >
          + Tambah
        </Link>
      </div>

      <div className="grid gap-4">
        {semuaKamar.map((kamar) => (
          <div key={kamar.id} className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
             {/* Label Tipe di Pojok */}
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[8px] px-4 py-1 rounded-bl-2xl font-bold uppercase">
              {kamar.tipe}
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nomor Kamar</p>
              <h3 className="text-2xl font-black text-gray-800">{kamar.nomorKamar}</h3>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harga /Bulan</p>
                <p className="font-bold text-blue-600 italic">Rp {kamar.harga.toLocaleString('id-ID')}</p>
              </div>
              
              <TombolHapus id={kamar.id} nomor={kamar.nomorKamar} />
              <Link 
            href={`/dashboard/admin/kamar/edit/${kamar.id}`}
            className="px-4 py-2 bg-gray-400 text-[10px] font-black rounded-xl uppercase hover:bg-black hover:text-white transition-all"
            >
            Edit
            </Link>
            </div>
          </div>
        ))}

        {semuaKamar.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-sm italic">Belum ada kamar terdaftar</p>
          </div>
        )}
      </div>
    </div>
  )
}