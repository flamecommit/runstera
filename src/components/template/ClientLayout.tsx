'use client';

import GlobalSpinner from '@/components/common/GlobalSpinner';
import { useGlobalSpinner } from '@/stores/ui';
import { DialogProvider } from '@shinyongjun/react-dialog';
import '@shinyongjun/react-dialog/css';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: IProps) {
  const { pending } = useGlobalSpinner();

  return (
    <DialogProvider>
      {children}
      {pending && <GlobalSpinner />}
    </DialogProvider>
  );
}
