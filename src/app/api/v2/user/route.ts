import { supabase } from '@/lib/supabase';
import { verifyAccessToken } from '@/utils/jwt';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const user_uuid = verifyAccessToken(req);
    if (!user_uuid) return ResponseError(50104); // uuid 없음

    // 사용자 삭제
    const { error: userDeleteError } = await supabase
      .from('users')
      .delete()
      .eq('uuid', user_uuid);

    if (userDeleteError) {
      console.error('User delete error:', userDeleteError);
      return ResponseError(50002);
    }

    return ResponseSuccess({ deleted: true });
  } catch (e) {
    console.error('DELETE /api/v2/user/[uuid]/route.ts error:', e);
    return ResponseError(59999);
  }
}
