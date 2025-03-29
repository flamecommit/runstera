'use client';

import BottomNavigation from '@/components/layout/BottomNavigation';
import { ReactNode } from 'react';
import styled from 'styled-components';

interface IProps {
  children: ReactNode;
}

export default function BaseTemplate({ children }: IProps) {
  return (
    <StyledBaseTemplate>
      {children}
      <BottomNavigation />
    </StyledBaseTemplate>
  );
}

const StyledBaseTemplate = styled.div`
  max-width: 768px;
  min-height: 100vh;
  margin: 0 auto;
`;
