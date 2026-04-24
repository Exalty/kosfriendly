import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { revalidatePath } from "next/cache"

export default async function CheckOutPage() {
  const session = await auth()
  if (!session) redirect("/")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { kamar: true }
  })

  if (!user?.kamar) redirect("/dashboard")

  async function prosesCheckOut() {
    'use server'
    
    // Hapus hubungan user dengan kamar
    await prisma.user.update({
      where: { id: session?.user?.id },
      data: { kamarId: null }
    })

    revalidatePath("/dashboard")
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white p-6 font-sans flex flex-col items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🚪</div>
        <h1 className="text-3xl font-black italic tracking-tighter text-gray-900 uppercase mb-2">Check Out.</h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-10">
          Kamar {user.kamar.nomorKamar} — {user.kamar.tipe}
        </p>

        <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 mb-10">
          <p className="text-sm font-bold text-red-600 leading-relaxed italic">
            "Apakah kamu yakin ingin keluar dari kamar ini? Kamu harus melakukan booking ulang jika ingin masuk kembali."
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <form action={prosesCheckOut}>
            <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-red-100 active:scale-95 transition-all">
              Ya, Saya Keluar Sekarang
            </button>
          </form>
          
          <Link href="/dashboard" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
            Batal & Kembali
          </Link>
        </div>
      </div>
    </div>
  )
}