'use client'

import { useState } from 'react'
import { buatKomplain } from './action'
import { useSession } from 'next-auth/react'

export default function KomplainClient() {
    const { data: session } = useSession()
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)

  return (
    <>
      {/* Tombol Floating (+) */}
      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-10 right-6 w-14 h-14 bg-black text-white rounded-full text-3xl shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        +
      </button>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold mb-6 text-center text-gray-800">Tulis Komplain</h3>
            
            <form action={async (formData) => {
                const uid = session?.user?.id
                if (!uid) return alert("Sesi habis, silakan login ulang")
                setLoading(true)
                try{
                    await buatKomplain(formData, uid)
                    setShowModal(false)
                } catch (err) {
                    alert("Gagal mengirim komplain")
                } finally {
                    setLoading(false)
                }
            }}>
              <input 
                name="subjek" 
                placeholder="Apa yang rusak?" 
                className="w-full border-b border-gray-100 py-3 mb-4 focus:outline-none focus:border-black transition-colors"
                required
              />
              <textarea 
                name="deskripsi" 
                placeholder="Ceritakan detailnya di sini..." 
                className="w-full bg-gray-50 rounded-2xl p-4 h-32 mb-6 focus:outline-none text-sm"
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold tracking-widest disabled:bg-gray-400 active:scale-95 transition-all"
              >
                {loading ? 'MENGIRIM...' : 'KIRIM KOMPLAIN'}
              </button>
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full mt-4 text-gray-400 text-xs font-bold uppercase tracking-wider"
              >
                Batal
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}