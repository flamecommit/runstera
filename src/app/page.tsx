'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import styled from 'styled-components';

function TokenLoginHandler() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      signIn('credentials', {
        token,
        callbackUrl: '/tracker', // 로그인 후 이동할 경로
      });
    }
  }, [token]);

  return null;
}

export default function RootPage() {
  return (
    <StyledRootPage>
      <div className="app-name">Runstera</div>
      <Suspense fallback={null}>
        <TokenLoginHandler />
      </Suspense>
    </StyledRootPage>
  );
}

const StyledRootPage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 24px;
  background-image: url(/images/home-background.webp);
  background-position: center;
  background-size: cover;
  .app-name {
    position: absolute;
    right: 0;
    top: 24%;
    left: 0;
    font-weight: 700;
    font-size: 60px;
    text-align: center;
    color: #fff;
    text-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  }
`;
