import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Hanya proteksi rute di bawah /admin
  if (pathname.startsWith("/admin")) {
    console.log(`[Middleware-Guard] Mencoba mengakses rute terproteksi: ${pathname}`);
    
    // Log cookie untuk debugging local/production
    const allCookies = req.cookies.getAll();
    const authCookies = allCookies
      .filter(c => c.name.includes("next-auth") || c.name.includes("session"))
      .map(c => `${c.name}=${c.value.substring(0, 10)}...`);
    
    console.log(`[Middleware-Guard] Cookies terkait Auth yang terdeteksi:`, authCookies);
    console.log(`[Middleware-Guard] NEXTAUTH_SECRET Terkonfigurasi: ${process.env.NEXTAUTH_SECRET ? `Ya (Length: ${process.env.NEXTAUTH_SECRET.length})` : 'TIDAK'}`);

    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_JWT_SECRET,
      });

      console.log(`[Middleware-Guard] Hasil Token JWT:`, token ? `Valid (Username: ${token.name || token.email || 'Admin'})` : 'NULL (Tidak terautentikasi)');

      if (!token) {
        console.warn(`[Middleware-Guard] AKSES DITOLAK! Mengalihkan ke halaman login (/portal-thn)`);
        const loginUrl = new URL("/portal-thn", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      console.log(`[Middleware-Guard] AKSES DIIZINKAN ke ${pathname}`);
    } catch (error) {
      console.error(`[Middleware-Guard] ERROR saat validasi token:`, error);
      // Demi keamanan, jika error saat validasi token, kita redirect ke halaman login
      const loginUrl = new URL("/portal-thn", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
