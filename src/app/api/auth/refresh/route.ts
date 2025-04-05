// app/api/auth/refresh/route.ts

import { ACCESS_TOKEN_EXPIRY } from '@/constants/token';
import { supabase } from '@/lib/supabase';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      // 필수 정보 누락
      return ResponseError(50104);
    }

    // 1. refreshToken 검증
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;

    const uuid = decoded?.sub;
    if (!uuid) {
      // 유효하지 않은 토큰
      return ResponseError(50108);
    }

    // 2. 유저 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('uuid, email, name, image')
      .eq('uuid', uuid)
      .maybeSingle();

    if (error || !user) {
      // 데이터를 찾을 수 없음
      return ResponseError(50103);
    }

    // 3. 새로운 accessToken 발급
    const accessToken = jwt.sign({ sub: user.uuid }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    return ResponseSuccess({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token: {
        accessToken,
      },
    });
  } catch (err: any) {
    console.error('refreshToken error:', err.message);
    return ResponseError(59999);
  }
}
