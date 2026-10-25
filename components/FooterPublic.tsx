'use client'

export default function FooterPublic() {
  const handleWhatsApp = () => {
    window.open('https://wa.me/628123456789', '_blank')
  }

  return (
    <footer className="w-full border-t border-gray-200 bg-white/95 backdrop-blur-sm sticky bottom-0 z-20 shadow-sm">
      <div className="max-w-lg mx-auto flex justify-around items-center px-4 py-4">
        <button 
          onClick={() => window.open('https://maps.google.com', '_blank')}
          className="flex flex-col items-center gap-1 group py-1 px-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <span className="text-2xl">📍</span>
          <span className="text-xs font-bold uppercase text-gray-700 group-hover:text-blue-600 transition-colors">Lokasi</span>
        </button>
        
        <button 
          onClick={handleWhatsApp}
          className="flex flex-col items-center gap-1 group py-1 px-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <span className="text-2xl">💬</span>
          <span className="text-xs font-bold uppercase text-gray-700 group-hover:text-green-600 transition-colors">WhatsApp</span>
        </button>
        
        <button 
          onClick={() => window.location.href = 'mailto:info@kosfriendly.com'}
          className="flex flex-col items-center gap-1 group py-1 px-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <span className="text-2xl">✉️</span>
          <span className="text-xs font-bold uppercase text-gray-700 group-hover:text-red-600 transition-colors">Email</span>
        </button>
      </div>
    </footer>
  )
}
