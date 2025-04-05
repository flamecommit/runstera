import { USER_TABLE } from '@/constants/table';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '@/constants/token';
import { supabase } from '@/lib/supabase';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return ResponseError(50104);
    }

    // access_token 검증 및 사용자 정보 요청
    const googleRes = await fetch(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!googleRes.ok) {
      return ResponseError(50108);
    }

    const googleUser = await googleRes.json();

    // 2. Supabase에서 회원 조회
    const { data: user, error: userError } = await supabase
      .from(USER_TABLE)
      .select('*')
      .eq('email', googleUser.email)
      .single();

    if (userError || !user) {
      // 비회원 : token이 비어있음.
      return ResponseSuccess({
        user: {
          name: googleUser.name,
          email: googleUser.email,
          image: googleUser.picture,
        },
        token: {
          accessToken: null,
          refreshToken: null,
        },
        isExistingUser: false,
      });
    }

    const accessToken = jwt.sign(
      { uuid: user.uuid, email: googleUser.email },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY },
    );

    const refreshToken = jwt.sign(
      { uuid: user.uuid, email: googleUser.email },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRY },
    );

    // 예: { email, name, picture, id, verified_email: true }
    return ResponseSuccess({
      user: {
        email: user.email,
        name: user.name,
        image: user.picture,
      },
      token: {
        accessToken,
        refreshToken,
      },
      isExistingUser: true,
    });
  } catch (err) {
    console.error(err);
    return ResponseError(59999);
  }
}
