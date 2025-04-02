'use client';

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

  return <div>Redirecting...</div>;
}

export default function AuthBridgePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthBridge />
    </Suspense>
  );
}
