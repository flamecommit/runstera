'use client';

import GlobalSpinner from '@/components/common/GlobalSpinner';
import { useGlobalSpinner } from '@/stores/ui';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: IProps) {
  const { pending } = useGlobalSpinner();

  return (
    <>
      {children}
      {pending && <GlobalSpinner />}
    </>
  );
}
