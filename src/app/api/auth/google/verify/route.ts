import { ResponseError, ResponseSuccess } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return ResponseError(50104);
    }

    // access_token 검증 및 사용자 정보 요청
    const res = await fetch(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      return ResponseError(50108);
    }

    const userInfo = await res.json();

    // 예: { email, name, picture, id, verified_email: true }
    return ResponseSuccess({
      email: userInfo.email,
      name: userInfo.name,
      image: userInfo.picture,
      googleId: userInfo.id,
    });
  } catch (err) {
    console.error(err);
    return ResponseError(59999);
  }
}
