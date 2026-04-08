import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isProtected =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/simulacros') ||
    request.nextUrl.pathname.startsWith('/flashcards') ||
    request.nextUrl.pathname.startsWith('/ranking') ||
    request.nextUrl.pathname.startsWith('/estadisticas') ||
    request.nextUrl.pathname.startsWith('/perfil') ||
    request.nextUrl.pathname.startsWith('/configuracion');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/simulacros/:path*',
    '/flashcards/:path*',
    '/ranking/:path*',
    '/estadisticas/:path*',
    '/perfil/:path*',
    '/configuracion/:path*',
  ],
};
