'use client' // Wajib ada ini di baris pertama

export default function TombolPrint() {
  return (
    <button 
      onClick={() => window.print()}
      className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all print:hidden"
    >
      Print
    </button>
  )
}