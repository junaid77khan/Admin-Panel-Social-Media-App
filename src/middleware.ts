import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to handle authentication
export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get('isAuthenticated')?.value === 'true';

  // Redirect unauthenticated users trying to access `/dashboard`
  if (!isAuthenticated && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect authenticated users away from `/login` if they’re already logged in
  if (isAuthenticated && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next(); // Proceed with the request
}

// Apply middleware only to specific routes
export const config = {
  matcher: ['/dashboard', '/login'], // Specify the routes where middleware should run
};
