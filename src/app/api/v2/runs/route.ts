import { RUN_TABLE } from '@/constants/table';
import { supabase } from '@/lib/supabase';
import { verifyAccessToken } from '@/utils/jwt';
import { ResponseError, ResponseSuccess } from '@/utils/response';

// Runs 목록 조회
export async function GET(req: Request) {
  try {
    const user_uuid = verifyAccessToken(req);

    if (!user_uuid) {
      // 유효하지 않은 AccessToken
      return ResponseError(50108);
    }

    const { data, error } = await supabase
      .from(RUN_TABLE)
      .select('*')
      .eq('user_uuid', user_uuid)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      return ResponseError(59999);
    }

    return ResponseSuccess(data);
  } catch {
    return ResponseError(59999);
  }
}

// Runs 신규 등록
export async function POST(req: Request) {
  try {
    const user_uuid = verifyAccessToken(req);

    if (!user_uuid) {
      // 유효하지 않은 AccessToken
      return ResponseError(50108);
    }

    const {
      startedAt,
      endedAt,
      duration,
      title = '',
      route = [],
      distance,
    } = await req.json();

    // 현재 시간 (created_at, updated_at)
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from(RUN_TABLE)
      .insert([
        {
          user_uuid,
          title,
          started_at: startedAt,
          ended_at: endedAt,
          duration,
          route,
          distance,
          created_at: now,
        },
      ])
      .select(); // 삽입 후 데이터 반환

    if (error) {
      console.error('Supabase insert error:', error);
      return ResponseError(59999);
    }

    return ResponseSuccess(data?.[0]);
  } catch (error) {
    console.error('Error adding person:', error);
    return ResponseError(59999);
  }
}
