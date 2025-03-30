'use client';

import { color } from '@/styles/variable';
import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'primary' | 'black' | 'gray';
}

export default function Button({ color, ...rest }: IProps) {
  return (
    <StyledButton data-color={color} {...rest}>
      {rest.children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  width: 100%;
  border-radius: 4px;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  &[data-color='primary'] {
    background-color: ${color.primary};
  }
  &[data-color='black'] {
    background-color: #000;
  }
  &[data-color='gray'] {
    background-color: #ccc;
  }
`;
