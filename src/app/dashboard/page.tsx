'use client';

import request from '@/utils/request';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [saved] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !saved) {
      console.log('useEffect');
      const { name, email, image } = session.user;

      const handleUserRegist = async () => {
        console.log('handleUserRegist');
        try {
          const { code } = await request({
            method: 'POST',
            url: '/api/user',
            body: { name, email, image },
          });

          console.log(code);

          if (code === 200) {
            console.log('success');
          }
        } catch (error) {
          console.log('error', error);
        } finally {
          console.log('finally');
        }
      };

      handleUserRegist();
    }
  }, [session, status, saved]);

  console.log('session :', session);

  return (
    <div>
      <div>Dashboard</div>
    </div>
  );
}
