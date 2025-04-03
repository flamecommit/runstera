'use client';

import LoadingComment from '@/components/common/LoadingComment';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function AuthBridge() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      signIn('credentials', {
        token,
        callbackUrl: '/auth/check',
      });
    }
  }, [token]);

  return <LoadingComment>손목 발목 돌리는 중</LoadingComment>;
}

export default function AuthBridgePage() {
  return (
    <Suspense fallback={<LoadingComment>운동화끈 고쳐 묵는 중</LoadingComment>}>
      <AuthBridge />
    </Suspense>
  );
}
