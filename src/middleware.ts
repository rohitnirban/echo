import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/music', '/trending', '/'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET });
  const url = request.nextUrl;

  if (token && (url.pathname === '/')) {
    return NextResponse.redirect(new URL('/music', request.url));
  }

  if (!token && url.pathname.startsWith('/music') && url.pathname.startsWith('/trending') ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
