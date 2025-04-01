'use client';

import { ReactNode } from 'react';
import styled from 'styled-components';

interface IProps {
  children?: ReactNode;
}

export default function PolicyContent({ children }: IProps) {
  return <StyledPolicyContent>{children}</StyledPolicyContent>;
}

const StyledPolicyContent = styled.div``;
