import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Google OAuth id_token 검증
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
    );
    if (!res.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const googleUser = await res.json();

    // 예시로 반환되는 정보
    // {
    //   "email": "example@gmail.com",
    //   "name": "John Doe",
    //   "picture": "https://...",
    //   "sub": "Google User ID"
    // }

    // 사용자 정보를 클라이언트에 전달
    return NextResponse.json({
      email: googleUser.email,
      name: googleUser.name,
      image: googleUser.picture,
      googleId: googleUser.sub,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
