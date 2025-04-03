import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  // const token = await getToken({ req });
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const response = NextResponse.next();

  const exactPublicPaths = ['/'];
  const prefixPublicPaths = ['/auth'];

  const isExactPublic = exactPublicPaths.includes(pathname);
  const isPrefixPublic = prefixPublicPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isExactPublic && token) {
    return NextResponse.redirect(new URL('/tracker', req.url));
  }

  if (isPrefixPublic) {
    response.headers.set('x-access-token', token?.accessToken as string);
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/((?!_next|api|favicon.ico|images).*)'],
};
