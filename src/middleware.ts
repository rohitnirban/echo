import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/music', '/trending', '/', '/library'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET });

  console.log(token);

  const url = request.nextUrl;

  if (token && url.pathname === '/') {
    return NextResponse.redirect(new URL('/music', request.url));
  }

  if (!token && (url.pathname.startsWith('/music') || url.pathname.startsWith('/trending') || url.pathname.startsWith('/library'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
