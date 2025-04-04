import { USER_TABLE } from '@/constants/table';
import { supabase } from '@/lib/supabase';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

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
    const { email, name, image } = googleUser;

    // 2. Supabase에서 회원 조회
    const { data: user, error: userError } = await supabase
      .from(USER_TABLE)
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return ResponseSuccess({
        user: {
          email,
          name,
          image,
        },
        token: {
          accessToken: null,
          refreshToken: null,
        },
        isExistingUser: false,
      });
    }

    const accessToken = jwt.sign(
      { sub: user.uuid, email },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY },
    );

    const refreshToken = jwt.sign(
      { sub: user.uuid },
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
