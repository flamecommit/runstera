'use client';

import { ReactNode } from 'react';
import styled from 'styled-components';

interface IProps {
  children?: ReactNode;
}

export default function PageTitle({ children }: IProps) {
  return <StyledPageTitle>{children}</StyledPageTitle>;
}

const StyledPageTitle = styled.h2`
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 12px;
`;
