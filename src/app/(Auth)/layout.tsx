'use client';

import BaseTemplate from '@/components/template/BaseTemplate';
import { useTrackerStore } from '@/stores/tracker';
import { useUserStore } from '@/stores/user';
import { IUser } from '@/types/user';
import request from '@/utils/request';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export default function BottomNavigationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const { data: user, setData: setUser } = useUserStore();
  const preWatchIdRef = useRef<number | null>(null);
  const { setCurrentPosition, setGpsStatus } = useTrackerStore();

  // User 정보 Store에 저장
  useEffect(() => {
    if (status === 'authenticated' && session?.user && user === null) {
      const { email } = session.user;

      const handleUserRegist = async () => {
        try {
          const { data, code } = await request<IUser | null>({
            method: 'GET',
            url: '/api/user',
            searchParams: { email },
          });

          if (code === 200) {
            if (data === null) {
              signOut({ callbackUrl: '/' });
              return;
            }
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

  // GPS 저장
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }

    setGpsStatus('requesting');

    // 위치 권한 요청 및 초기 위치 트래킹 시작
    preWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        // const latlng: TLatLng = [pos.coords.latitude, pos.coords.longitude];
        // setCurrentPosition(latlng);
        setCurrentPosition(pos);
        setGpsStatus('acquired');
      },
      (err) => {
        console.error(err);
        setGpsStatus('error');
      },
      { enableHighAccuracy: true },
    );

    // 언마운트 시 watch 제거
    return () => {
      if (preWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(preWatchIdRef.current);
      }
    };
  }, [setCurrentPosition, setGpsStatus]);

  return (
    <BaseTemplate>
      {/* <UserStatus /> */}
      {children}
    </BaseTemplate>
  );
}
