'use client';

import Portal from '@/components/common/Portal';
import styled from 'styled-components';

interface IProps {
  background?: string;
}

export default function GlobalSpinner({
  background = 'rgba(0, 0, 0, 0.5)',
}: IProps) {
  return (
    <Portal selector="body">
      <StyledSpinner $background={background}>
        <div className="widget" />
      </StyledSpinner>
    </Portal>
  );
}

const StyledSpinner = styled.div<{ $background: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $background }) => $background};
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .widget {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    border-radius: 6px;
    &:after {
      display: block;
      content: '';
      width: 60px;
      height: 60px;
      border: 5px solid var(--reverse-color);
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }
  }
`;
