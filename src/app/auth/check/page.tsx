'use client';

import LoadingComment from '@/components/common/LoadingComment';
import { useUserStore } from '@/stores/user';
import { IUser } from '@/types/user';
import request from '@/utils/request';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// session에 user정보 저장된 상태
export default function AuthCheckPage() {
  const { data: session } = useSession();
  const { setData: setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) return;

    const { email } = session.user;

    const checkUserEmail = async () => {
      try {
        const { data, code } = await request<IUser | null>({
          method: 'GET',
          url: '/api/auth/check',
          searchParams: { email },
        });

        if (code === 200) {
          if (data !== null) {
            setUser(data);
            router.push('/tracker');
          } else {
            router.push('/auth/signup');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkUserEmail();
  }, [router, session?.user, setUser]);

  return <LoadingComment>출발선 어딨는지 찾는 중</LoadingComment>;
}
