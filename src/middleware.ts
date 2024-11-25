import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get('isAuthenticated')?.value === 'true';

  if (!isAuthenticated && (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/Users') || req.nextUrl.pathname.startsWith('/Content') || req.nextUrl.pathname.startsWith('/Analytics') || req.nextUrl.pathname.startsWith('/Block-Chain'))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthenticated && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: ['/dashboard', '/login'], 
};
