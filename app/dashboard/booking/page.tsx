import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { revalidatePath } from "next/cache"

export default async function BookingKamarPage() {
  const session = await auth()
  
  // 1. Proteksi: Harus login sebagai pelanggan
  if (!session || session.user?.role !== "PELANGGAN") redirect("/")

  // 2. Cek status kamar user
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { kamarId: true }
  })

  // Jika masih punya kamar, kembalikan ke dashboard utama
  if (user?.kamarId) redirect("/dashboard")

  // 3. Ambil daftar kamar kosong
  const kamarTersedia = await prisma.kamar.findMany({
    where: {
      penghuni: { none: {} }
    },
    orderBy: { nomorKamar: 'asc' }
  })

  // 4. Server Action untuk Re-Booking
  async function prosesBooking(formData: FormData) {
    'use server'
    const idKamar = formData.get("kamarId") as string
    const idUser = session?.user?.id

    if (!idUser || !idKamar) return

    await prisma.user.update({
      where: { id: idUser },
      data: { kamarId: idKamar }
    })

    revalidatePath("/dashboard")
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-md mx-auto pt-4 pb-20">
        
        {/* Header Sesuai Desain Kamu */}
        <header className="mb-10">
          <Link href="/dashboard" className="text-gray-200 mb-6 block w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Cari Kamar Baru</p>
          <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase leading-none">Booking.</h1>
        </header>

        <div className="space-y-6">
          {kamarTersedia.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
              <p className="text-[10px] font-black text-gray-300 uppercase italic">Maaf, semua kamar terisi.</p>
            </div>
          )}

          {kamarTersedia.map((kamar) => (
            <div key={kamar.id} className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-indigo-50 group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[8px] font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">
                    {kamar.tipe}
                  </span>
                  <h2 className="text-3xl font-black italic tracking-tighter text-gray-900 mt-4 uppercase">
                    {kamar.nomorKamar}
                  </h2>
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-black text-gray-400 uppercase">Harga</p>
                   <p className="text-lg font-black italic text-indigo-600 tracking-tighter">
                     {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kamar.harga)}
                   </p>
                </div>
              </div>

              <div className="mb-8 border-y border-gray-200/50 py-4">
                <p className="text-[11px] text-gray-500 font-medium italic leading-relaxed text-center px-4">
                  "{kamar.fasilitas}"
                </p>
              </div>

              <form action={prosesBooking}>
                <input type="hidden" name="kamarId" value={kamar.id} />
                <button className="w-full bg-[#0f172a] text-white py-5 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-all shadow-xl shadow-gray-200 group-hover:bg-indigo-600">
                  Pilih Kamar Ini →
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}