'use client';

import LoadingComment from '@/components/common/LoadingComment';
import { useUserStore } from '@/stores/user';
import { IUser } from '@/types/user';
import request from '@/utils/request';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthSignupPage() {
  const { data: session, status } = useSession();
  const { setData: setUser } = useUserStore();
  const router = useRouter();

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
            router.push('/tracker');
          }
        } catch (error) {
          console.log('error', error);
        } finally {
          console.log('finally');
        }
      };

      handleUserRegist();
    }
  }, [session, status, setUser, router]);

  return <LoadingComment>단백질바 한 입 먹는 중</LoadingComment>;
}
