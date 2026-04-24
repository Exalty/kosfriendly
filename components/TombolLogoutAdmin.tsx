'use client'

import { signOut } from "next-auth/react"

export default function TombolLogoutAdmin() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="bg-red-50 text-red-500 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
    >
      Sign Out & Exit
    </button>
  )
}