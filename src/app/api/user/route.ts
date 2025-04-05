import { USER_TABLE } from '@/constants/table';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '@/constants/token';
import { supabase } from '@/lib/supabase';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const email = searchParams.get('email');

    if (!email) {
      return ResponseError(50104); // 필수 필드 누락
    }

    const { data, error } = await supabase
      .from(USER_TABLE)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // row not found
        return ResponseSuccess(null);
      }
      throw error;
    }

    return ResponseSuccess(data);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return ResponseError(59999);
  }
}

// User 신규 등록
export async function POST(req: Request) {
  try {
    const { email, name, image } = await req.json();

    if (!email) {
      return ResponseError(50104); // 필수 필드 누락
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ email, name, image, created_at: new Date() }])
      .select(); // 삽입 후 반환

    if (error) {
      console.error('Supabase insert error:', error);
      return ResponseError(59999);
    }

    const user = data?.[0];

    const accessToken = jwt.sign({ sub: user.uuid }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign({ sub: user.uuid }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    return ResponseSuccess({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token: {
        accessToken,
        refreshToken,
      },
      isExistingUser: true,
    });
  } catch (error) {
    console.error('Error adding person:', error);
    return ResponseError(59999);
  }
}
