'use client';

import { ReactNode } from 'react';
import styled from 'styled-components';

interface IProps {
  children?: ReactNode;
}

export default function PolicyTitle({ children }: IProps) {
  return <StyledPolicyTitle>{children}</StyledPolicyTitle>;
}

const StyledPolicyTitle = styled.h2`
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 24px;
`;
