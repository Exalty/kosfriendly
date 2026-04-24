import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("bukti") as File;
    const userId = formData.get("userId") as string;
    const jumlah = formData.get("jumlah") as string;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // 1. Persiapkan nama file unik untuk Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // 2. Upload file ke Supabase Storage (Bucket: 'pembayaran')
    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("pembayaran") // Pastikan nama bucket di Supabase sama persis
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      return NextResponse.json({ error: "Gagal upload ke storage" }, { status: 500 });
    }

    // 3. Ambil Public URL dari file yang baru diupload
    const { data: urlData } = supabase.storage
      .from("pembayaran")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // 4. Simpan Data ke Database Prisma
    // Kita simpan FULL URL agar admin bisa langsung klik/lihat fotonya
    const pembayaran = await prisma.pembayaran.create({
      data: {
        userId: userId,
        jumlah: parseInt(jumlah),
        metode: "TRANSFER",
        buktiBayar: publicUrl, // Link https://...
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, data: pembayaran });
  } catch (error) {
    console.error("Global Upload Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}