'use client';

import { color } from '@/styles/variable';
import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'primary' | 'black' | 'gray';
}

export default function TrackerButton({ color, ...rest }: IProps) {
  return (
    <StyledTrackerButton data-color={color} {...rest}>
      {rest.children}
    </StyledTrackerButton>
  );
}

const StyledTrackerButton = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 50%;
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
  &:disabled {
    background-color: #ccc;
  }
`;
