'use client';

import styled from 'styled-components';

interface IProps {
  absolute?: boolean;
  height?: number;
}

export default function Spinner({ absolute = true, height = 200 }: IProps) {
  return (
    <StyledSpinner data-absolute={absolute} $height={height}>
      <div className="widget" />
    </StyledSpinner>
  );
}

const StyledSpinner = styled.div<{ $height?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  height: ${({ $height }) => `${$height}px` || 'auto'};
  &[data-absolute='true'] {
    position: absolute;
    inset: 0;
    z-index: 10000;
  }
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
    &:after {
      display: block;
      content: '';
      width: 36px;
      height: 36px;
      border: 4px solid #fff;
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }
  }
`;
