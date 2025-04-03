'use client';

import { color } from '@/styles/variable';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

interface IProps {
  children?: ReactNode;
}

export default function LoadingComment({ children }: IProps) {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1); // 1 → 2 → 3 → 1 ...
    }, 500); // 점 변화 주기

    return () => clearInterval(interval);
  }, []);

  const dots = '.'.repeat(dotCount);

  return (
    <StyledLoadingComment>
      {children}
      {dots}
    </StyledLoadingComment>
  );
}

const StyledLoadingComment = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  font-size: 20px;
  font-weight: 500;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  background-color: ${color.primary};
`;
