'use client';

import { color } from '@/styles/variable';
import { ButtonHTMLAttributes, useRef, useState } from 'react';
import styled from 'styled-components';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'primary' | 'black' | 'gray';
  longPressDuration?: number;
}

export default function TrackerButton({
  color,
  longPressDuration = 0,
  onClick,
  ...rest
}: IProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);

  const clearTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  };

  const handleMouseDown = () => {
    if (longPressDuration > 0) {
      startTimeRef.current = Date.now();
      setProgress(0);

      // 매 100ms마다 퍼센트 계산
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const percent = Math.min((elapsed / longPressDuration) * 100, 100);
        setProgress(percent);
      }, 50);

      timeoutRef.current = setTimeout(() => {
        onClick?.(new MouseEvent('click') as any);
        clearTimers();
        setProgress(0);
      }, longPressDuration);
    }
  };

  const handleMouseUp = () => {
    if (longPressDuration > 0) {
      clearTimers();
      setProgress(0);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (longPressDuration === 0 && onClick) {
      onClick(e);
    }
  };

  return (
    <StyledTrackerButton
      data-color={color}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onClick={handleClick}
      $progress={progress}
      {...rest}
    >
      {rest.children}
    </StyledTrackerButton>
  );
}

const StyledTrackerButton = styled.button<{ $progress?: number }>`
  overflow: hidden;
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  color: #fff;
  font-size: 0;
  z-index: 1000;
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
    &:before {
      display: block;
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: ${({ $progress }) => `${$progress}%`};
      background-color: ${color.primary};
    }
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
