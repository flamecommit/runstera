import { supabase } from '@/lib/supabase';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import { NextRequest } from 'next/server';

type IParams = Promise<{
  uuid: string;
}>;

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: IParams;
  },
) {
  try {
    const { uuid } = await params;
    if (!uuid) return ResponseError(50104); // uuid 없음

    // 사용자 삭제
    const { error: userDeleteError } = await supabase
      .from('users')
      .delete()
      .eq('uuid', uuid);

    if (userDeleteError) {
      console.error('User delete error:', userDeleteError);
      return ResponseError(50002);
    }

    return ResponseSuccess({ deleted: true });
  } catch (e) {
    console.error('DELETE /api/user/[uuid]/route.ts error:', e);
    return ResponseError(59999);
  }
}
