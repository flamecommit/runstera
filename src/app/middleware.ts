import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  console.log('token', token?.email);

  if (req.nextUrl.pathname !== '/') {
    if (!token?.email) {
      return NextResponse.redirect(new URL(`/`, req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith('/signin')) {
    if (token?.email) {
      return NextResponse.redirect(new URL(`/dashboard`, req.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|forumapi|nftapi|videos).*)',
    '/',
  ],
};
