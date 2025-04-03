'use client';

import { useUserStore } from '@/stores/user';
import { IUser } from '@/types/user';
import request from '@/utils/request';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import styled from 'styled-components';

export default function AuthSignupPage() {
  const { data: session, status } = useSession();
  const { setData: setUser } = useUserStore();

  // 신규 회원 등록
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const { email, name, image } = session.user;

      const handleUserRegist = async () => {
        try {
          const { data, code } = await request<IUser>({
            method: 'POST',
            url: '/api/user',
            body: { email, name, image },
          });

          if (code === 200) {
            setUser(data);
          }
        } catch (error) {
          console.log('error', error);
        } finally {
          console.log('finally');
        }
      };

      handleUserRegist();
    }
  }, [session, status, setUser]);

  return <StyledAuthSignupPage>Signup...</StyledAuthSignupPage>;
}

const StyledAuthSignupPage = styled.div``;
