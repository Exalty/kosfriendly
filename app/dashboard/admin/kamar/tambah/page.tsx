import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { simpanKamar } from "../action"

export default async function TambahKamarPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/dashboard")

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-xl font-black text-gray-700 mb-8">Input Data Kamar</h2>

      <form action={async (formData) => {
        "use server"
        await simpanKamar(formData)
        redirect("/dashboard/admin/kamar")
      }} className="flex flex-col gap-6">
        
        <div className="group">
          <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Nomor Kamar</label>
          <input name="nomorKamar" type="text" placeholder="Misal: A-01" className="w-full border-b-2 border-gray-100 py-3 focus:outline-none focus:border-black transition-all font-bold text-lg text-gray-900 placeholder:text-gray-200" required />
        </div>

        <div className="group">
          <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Tipe Kamar</label>
          <select name="tipe" className="w-full border-b-2 py-3 focus:outline-none bg-transparent font-medium" required>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div className="group">
          <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Harga Sewa (Rp)</label>
          <input name="harga" type="number" placeholder="1500000" className="w-full border-b-2 border-gray-100 py-3 focus:outline-none focus:border-black transition-all font-bold text-gray-900 placeholder:text-gray-200" required />
        </div>

        <div className="group">
          <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Fasilitas</label>
          <textarea name="fasilitas" placeholder="AC, Kamar Mandi Dalam, Kasur..." className="w-full bg-gray-50 rounded-2xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-black transition-all text-gray-900 text-sm placeholder:text-gray-300 border border-gray-100" required />
        </div>

        <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold mt-4 shadow-lg active:scale-95 transition-all">
          SIMPAN DATA KAMAR
        </button>
      </form>
    </div>
  )
}