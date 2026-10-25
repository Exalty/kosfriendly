import { prisma } from "../../lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import FooterPublic from "@/components/FooterPublic"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default async function DetailKamarPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const session = await auth()
  
  const kamar = await prisma.kamar.findUnique({
    where: { id: params.id },
    include: { penghuni: true }
  })

  if (!kamar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-gray-900 font-sans">
        <h2 className="text-xl font-bold mb-2">Kamar tidak ditemukan</h2>
        <Link href="/pilih-kamar" className="text-sm font-semibold text-blue-600 hover:underline">
          ← Kembali ke daftar kamar
        </Link>
      </div>
    )
  }

  const isPenuh = kamar.penghuni.length > 0
  const userSudahPunyaKamar = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { kamarId: true }
  }) : null

  // Server action booking langsung bagi user yang sudah login
  async function handleBookingLangsung() {
    'use server'
    const sess = await auth()
    if (!sess?.user?.id) {
      redirect(`/login`)
    }

    // Cek apakah kamar masih kosong
    const k = await prisma.kamar.findUnique({
      where: { id: params.id },
      include: { penghuni: true }
    })

    if (!k || k.penghuni.length > 0) {
      redirect(`/pilih-kamar`)
    }

    await prisma.user.update({
      where: { id: sess.user.id },
      data: { kamarId: params.id }
    })

    revalidatePath('/dashboard')
    redirect('/dashboard')
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Tipe {kamar.tipe}
              </span>
              {isPenuh ? (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Sudah Terisi
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Tersedia
                </span>
              )}
            </div>
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

        {/* Tombol Aksi Booking */}
        {isPenuh ? (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-center mb-8">
            <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Kamar ini sudah berpenghuni. Silakan pilih unit lain yang tersedia.
            </p>
          </div>
        ) : session?.user ? (
          // USER SUDAH LOGIN
          userSudahPunyaKamar?.kamarId ? (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center mb-8">
              <p className="text-xs font-bold text-amber-800">
                Anda sudah memiliki kamar aktif. Selesaikan sewa saat ini sebelum memilih kamar baru.
              </p>
              <Link href="/dashboard" className="inline-block mt-2 text-xs font-bold text-gray-950 underline">
                Kembali ke Dashboard →
              </Link>
            </div>
          ) : (
            <form action={handleBookingLangsung} className="mb-8">
              <button
                type="submit"
                className="w-full bg-gray-950 text-white text-center py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl hover:bg-black transition active:scale-95 cursor-pointer"
              >
                Booking Kamar Ini Langsung →
              </button>
            </form>
          )
        ) : (
          // USER BELUM LOGIN
          <div className="flex flex-col gap-3 mb-8">
            <Link
              href={`/register?kamarId=${kamar.id}`}
              className="block w-full bg-gray-950 text-white text-center py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl hover:bg-black transition active:scale-95"
            >
              Booking & Buat Akun Baru →
            </Link>
            <Link
              href={`/login`}
              className="block w-full bg-white text-gray-950 border border-gray-300 text-center py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-gray-50 transition"
            >
              Sudah Punya Akun? Masuk di Sini
            </Link>
          </div>
        )}
      </div>

      <FooterPublic />
    </div>
  )
}
