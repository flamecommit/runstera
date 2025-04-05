import { RUN_TABLE } from '@/constants/table';
import { supabase } from '@/lib/supabase';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import { NextRequest } from 'next/server';

type IParams = Promise<{
  uuid: string;
}>;

// Runs 상세 조회
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: IParams;
  },
) {
  try {
    const { uuid } = await params;
    if (!uuid) {
      return ResponseError(50104);
    }

    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .eq('uuid', uuid)
      .single();

    if (error || !data) {
      console.error('GET run error:', error);
      return ResponseError(59999);
    }

    // ✅ route 필드 safe-parsing
    let parsedRoute: unknown[] = [];
    try {
      parsedRoute =
        typeof data.route === 'string'
          ? JSON.parse(data.route)
          : data.route ?? [];
    } catch {
      parsedRoute = [];
    }

    return ResponseSuccess({
      ...data,
      route: parsedRoute,
    });
  } catch {
    return ResponseError(59999);
  }
}

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
    if (!uuid) {
      return ResponseError(50104);
    }

    const { error } = await supabase.from(RUN_TABLE).delete().eq('uuid', uuid);

    if (error) {
      console.error('DELETE run error:', error);
      return ResponseError(59999);
    }

    return ResponseSuccess({ deleted: true });
  } catch (e) {
    console.error(e);
    return ResponseError(59999);
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: IParams;
  },
) {
  try {
    const { uuid } = await params;
    if (!uuid) {
      return ResponseError(50104); // uuid 없음
    }

    const body = await req.json();
    const { title } = body;
    if (typeof title !== 'string' || title.trim() === '') {
      return ResponseError(50105);
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from('runs')
      .update({ title, updated_at: now })
      .eq('uuid', uuid);

    if (error) {
      console.error('PUT run update error:', error);
      return ResponseError(59999);
    }

    return ResponseSuccess({ updated: true });
  } catch (e) {
    console.error('PUT error:', e);
    return ResponseError(59999);
  }
}
