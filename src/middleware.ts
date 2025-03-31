import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const exactPublicPaths = ['/'];
  const prefixPublicPaths = ['/signin'];

  const isExactPublic = exactPublicPaths.includes(pathname);
  const isPrefixPublic = prefixPublicPaths.some((path) =>
    pathname.startsWith(path),
  );

  if ((isExactPublic || isPrefixPublic) && token) {
    return NextResponse.redirect(new URL('/tracker', req.url));
  }

  if (!token && !isExactPublic && !isPrefixPublic) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/((?!_next|api|favicon.ico|images).*)'],
};
