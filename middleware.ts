import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  const { pathname } = req.nextUrl
  const role = token?.role as string

  // 1. IZINKAN AKSES TANPA SYARAT (Public Pages)
  // Tambahkan path lain jika ada yang ingin dibuat publik
  if (pathname === '/' || pathname === '/pilih-kamar' || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  // 2. PROTEKSI DASHBOARD (Jika belum login)
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 3. PROTEKSI LOGIN/REGISTER (Jika sudah login, tidak boleh balik ke sini)
  if (token && (pathname === '/login' || pathname === '/register')) {
    return redirectToFolder(role, req)
  }

  // 4. LOGIKA REDIRECT BERDASARKAN ROLE
  if (pathname === '/dashboard') {
    return redirectToFolder(role, req)
  }

  // 5. PROTEKSI SUB-FOLDER DASHBOARD
  if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
    return redirectToFolder(role, req)
  }
  if (pathname.startsWith('/dashboard/pemilik') && role !== 'PEMILIK') {
    return redirectToFolder(role, req)
  }
  if (pathname.startsWith('/dashboard/petugas') && role !== 'PETUGAS') {
    return redirectToFolder(role, req)
  }

  return NextResponse.next()
}

function redirectToFolder(role: string, req: NextRequest) {
  const url = req.nextUrl.clone()
  
  if (role === 'ADMIN') url.pathname = '/dashboard/admin'
  else if (role === 'PEMILIK') url.pathname = '/dashboard/pemilik'
  else if (role === 'PETUGAS') url.pathname = '/dashboard/petugas'
  else url.pathname = '/dashboard' // Pelanggan

  // Cegah loop jika tujuan sudah sama dengan asal
  if (req.nextUrl.pathname === url.pathname) {
    return NextResponse.next()
  }

  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}