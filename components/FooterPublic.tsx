'use client'

export default function FooterPublic() {
  const handleWhatsApp = () => {
    window.open('https://wa.me/628123456789', '_blank')
  }

  return (
    <div className="w-full border-t border-gray-100 bg-white sticky bottom-0 z-20">
      <div className="max-w-lg mx-auto flex justify-around items-center px-4 py-6">
        <button 
          onClick={() => window.open('https://maps.google.com', '_blank')}
          className="flex flex-col items-center gap-1 group"
        >
          <span className="text-xl">📍</span>
          <span className="text-[9px] font-bold uppercase text-gray-400 group-hover:text-blue-500">Lokasi</span>
        </button>
        
        <button 
          onClick={handleWhatsApp}
          className="flex flex-col items-center gap-1 group"
        >
          <span className="text-xl">💬</span>
          <span className="text-[9px] font-bold uppercase text-gray-400 group-hover:text-green-500">Whatsapp</span>
        </button>
        
        <button 
          onClick={() => window.location.href = 'mailto:info@kosfriendly.com'}
          className="flex flex-col items-center gap-1 group"
        >
          <span className="text-xl">✉️</span>
          <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-red-500">Email</span>
        </button>
      </div>
    </div>
  )
}