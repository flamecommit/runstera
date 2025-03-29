'use client';

import GlobalSpinner from '@/components/common/GlobalSpinner';
import { useGlobalSpinner } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { IUser } from '@/types/user';
import request from '@/utils/request';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

interface IProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: IProps) {
  const { pending } = useGlobalSpinner();
  const { data: session, status } = useSession();
  const { data: user, setData: setUser } = useUserStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user && user === null) {
      const { name, email, image } = session.user;

      const handleUserRegist = async () => {
        try {
          const { code, data } = await request<IUser>({
            method: 'POST',
            url: '/api/user',
            body: { name, email, image },
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
  }, [session, status, setUser, user]);

  return (
    <>
      {children}
      {pending && <GlobalSpinner />}
    </>
  );
}
