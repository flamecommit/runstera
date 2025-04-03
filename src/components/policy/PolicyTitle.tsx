'use client';

import BackButton from '@/components/layout/BackButton';
import { ReactNode } from 'react';
import styled from 'styled-components';

interface IProps {
  children?: ReactNode;
}

export default function PolicyTitle({ children }: IProps) {
  return (
    <StyledPolicyTitle>
      <BackButton />
      {children}
    </StyledPolicyTitle>
  );
}

const StyledPolicyTitle = styled.h2`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 60px;
  gap: 4px;
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 24px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
`;
