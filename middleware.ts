import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { auth } from "@/auth"


export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  const { pathname } = req.nextUrl
  const role = token?.role as string

  if (pathname === '/' || pathname === '/pilih-kamar') {
    return NextResponse.next()
  }

  // 1. Jika BELUM login & mencoba akses folder dashboard
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 2. Jika SUDAH login & mencoba akses /login atau /register
  // Kita arahkan ke dashboard masing-masing
  if (token && (pathname === '/login' || pathname === '/register')) {
    return redirectToFolder(role, req)
  }

  // 3. LOGIKA UTAMA CARA KE-2: 
  // Jika user akses ke "/dashboard" (tanpa sub-folder), 
  // kita arahkan otomatis berdasarkan role-nya.
  if (pathname === '/dashboard') {
    return redirectToFolder(role, req)
  }

  // 4. PROTEKSI: Mencegah user masuk ke folder yang bukan haknya
  if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
    return redirectToFolder(role, req)
  }
  if (pathname.startsWith('/dashboard/pemilik') && role !== 'PEMILIK') {
    return redirectToFolder(role, req)
  }
  if (pathname.startsWith('/dashboard/petugas') && role !== 'PETUGAS') {
    return redirectToFolder(role, req)
  }

  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/admin') && !pathname.startsWith('/dashboard/pemilik') && !pathname.startsWith('/dashboard/petugas')) {
    if (role === 'PELANGGAN') return NextResponse.next()
    // Jika role lain (Admin/Petugas) iseng akses /dashboard/komplain (area pelanggan), lempar balik ke folder mereka
    return redirectToFolder(role, req)
  }

  return NextResponse.next()
}

// Fungsi pembantu agar tidak menulis ulang kode redirect
function redirectToFolder(role: string, req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (role === 'ADMIN') return NextResponse.redirect(new URL('/dashboard/admin', req.url));
  if (role === 'PEMILIK') return NextResponse.redirect(new URL('/dashboard/pemilik', req.url));
  if (role === 'PETUGAS') return NextResponse.redirect(new URL('/dashboard/petugas', req.url));
  
  // KHUSUS PELANGGAN: 
  // Jika dia sudah di /dashboard, jangan di-redirect lagi (biar tidak loop)
  if (pathname === '/dashboard') return NextResponse.next();
  
  // Jika dia di /login tapi rolenya PELANGGAN, baru lempar ke /dashboard
  return NextResponse.redirect(new URL('/dashboard', req.url)); 
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}