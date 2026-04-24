import { prisma } from "@/app/lib/prisma"
import { updateKamar } from "../../action"

export default async function EditKamarPage(props: { params: Promise<{ id: string}> }) {
    const params = await props.params;
  const id = params.id;
  // Ambil data kamar yang lama
  const kamar = await prisma.kamar.findUnique({
    where: { id: params.id }
  })

  if (!kamar) return <div>Kamar tidak ditemukan</div>

  // Bind ID kamar ke action
  const updateKamarWithId = updateKamar.bind(null, kamar.id)

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">Edit Kamar {kamar.nomorKamar}</h1>

      <form action={updateKamarWithId} className="flex flex-col gap-6">
        
        <div className="group">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nomor Kamar</label>
          <input 
            name="nomorKamar" 
            defaultValue={kamar.nomorKamar}
            className="w-full border-b-2 border-gray-100 py-3 text-gray-900 font-bold focus:outline-none focus:border-black transition-all bg-transparent" 
            required 
          />
        </div>

        <div className="group">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tipe Kamar</label>
          <select 
            name="tipe" 
            defaultValue={kamar.tipe}
            className="w-full border-b-2 border-gray-100 py-3 text-gray-900 font-bold focus:outline-none focus:border-black bg-transparent"
          >
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div className="group">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Harga Sewa</label>
          <input 
            name="harga" 
            type="number"
            defaultValue={kamar.harga}
            className="w-full border-b-2 border-gray-100 py-3 text-gray-900 font-bold focus:outline-none focus:border-black transition-all bg-transparent" 
            required 
          />
        </div>

        <div className="group">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Fasilitas</label>
          <textarea 
            name="fasilitas" 
            defaultValue={kamar.fasilitas || ''}
            className="w-full bg-gray-50 rounded-2xl p-4 h-32 text-gray-900 text-sm focus:outline-none border border-gray-100 mt-2" 
          />
        </div>

        <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest mt-4 shadow-lg active:scale-95 transition-all">
          Simpan Perubahan
        </button>
      </form>
    </div>
  )
}