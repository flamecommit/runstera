import { ERROR_TYPE } from '@/constants/error';
import { NextResponse } from 'next/server';

export const ResponseError = (errorCode: number) => {
  const code = errorCode as keyof typeof ERROR_TYPE;

  return NextResponse.json({
    code: errorCode,
    data: {
      message: ERROR_TYPE[code]?.message || 'Undefined error',
      alert: ERROR_TYPE[code]?.alert || '정의되지 않은 오류',
    },
  });
};

export const ResponseSuccess = (data: any = null) => {
  return NextResponse.json({
    code: 200,
    data: data,
  });
};
