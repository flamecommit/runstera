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
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  color: #fff;
  font-size: 0;
  &:after {
    display: block;
    content: '';
    position: absolute;
    inset: 0;
    mask-size: 36px;
    mask-position: center;
  }
  &.play {
    &:after {
      mask-image: url(/images/icons/play.svg);
      mask-position: 36px center;
      background-color: #000;
    }
    &:disabled {
      &:after {
        background-color: #fff;
      }
    }
  }
  &.lock {
    &:after {
      mask-image: url(/images/icons/lock.svg);
      background-color: #fff;
    }
  }
  &.pause {
    &:after {
      mask-image: url(/images/icons/pause.svg);
      background-color: #fff;
    }
  }
  &.unlock {
    &:after {
      mask-image: url(/images/icons/unlock.svg);
      background-color: #fff;
    }
  }
  &.stop {
    &:after {
      mask-image: url(/images/icons/stop.svg);
      background-color: #fff;
    }
  }
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
