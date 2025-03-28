import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  const token =
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;
  const { pathname } = req.nextUrl;

  // 1. 로그인 상태에서 "/" 접근 시 "/dashboard"로 리디렉트
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. 미로그인 상태에서 보호된 페이지 접근 시 "/signin"으로 리디렉트
  const exactPublicPaths = ['/'];
  const prefixPublicPaths = [
    '/signin',
    '/_next',
    '/api',
    '/favicon.ico',
    '/images',
  ];

  const isExactPublic = exactPublicPaths.includes(pathname);
  const isPrefixPublic = prefixPublicPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (!token && !isExactPublic && !isPrefixPublic) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/((?!_next|api|favicon.ico|images|forumapi|nftapi|videos).*)',
  ],
};
