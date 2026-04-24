"use client"

import { updateStatusKomplain } from "./action"

export default function StatusSelector({ id, currentStatus }: { id: string, currentStatus: string }) {
  return (
    <select 
      defaultValue={currentStatus}
      onChange={(e) => updateStatusKomplain(id, e.target.value as any)}
      className="text-[10px] font-bold border-none bg-gray-100 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-black"
    >
      <option value="PENDING">PENDING</option>
      <option value="PROSES">PROSES</option>
      <option value="SELESAI">SELESAI</option>
    </select>
  )
}