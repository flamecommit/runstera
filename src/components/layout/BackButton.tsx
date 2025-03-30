'use client';

import { useRouter } from 'next/navigation';
import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export default function BackButton({
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();

  const handleRouterBack = () => {
    router.back();
  };

  return <StyledBackButton {...rest} onClick={handleRouterBack} />;
}

const StyledBackButton = styled.button`
  width: 48px;
  height: 48px;
  font-size: 0;
  mask-image: url(/images/icons/back.svg);
  mask-size: 24px;
  mask-position: center;
  background-color: #000;
`;
