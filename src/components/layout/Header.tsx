'use client';

import { ReactNode } from 'react';
import styled from 'styled-components';

interface IProps {
  children?: ReactNode;
}

export default function Header({ children }: IProps) {
  return <StyledHeader>{children}</StyledHeader>;
}

const StyledHeader = styled.header`
  position: relative;
  display: flex;
  height: 48px;
  border-bottom: 1px solid #ddd;
  .back {
    width: 48px;
    height: 48px;
    font-size: 0;
    mask-image: url(/images/icons/back.svg);
    mask-size: 24px;
    mask-position: center;
    background-color: #000;
  }
`;
