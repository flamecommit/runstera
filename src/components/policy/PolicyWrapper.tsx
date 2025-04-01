'use client';

import { ReactNode } from 'react';
import styled from 'styled-components';

interface IProps {
  children?: ReactNode;
}

export default function PolicyWrapper({ children }: IProps) {
  return <StyledPolicyWrapper>{children}</StyledPolicyWrapper>;
}

const StyledPolicyWrapper = styled.div`
  padding: 24px;
`;
