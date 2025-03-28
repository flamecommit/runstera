'use client';

import { ClientSafeProvider, signIn } from 'next-auth/react';
import styled from 'styled-components';

interface IProps {
  providers: Record<string, ClientSafeProvider>;
}

export default function SigninUI({ providers }: IProps) {
  return (
    <StyledSigninUI>
      {Object.values(providers).map((provider) => (
        <button
          key={provider.name}
          className={provider.id}
          onClick={() => signIn(provider.id)}
        >
          Sign in with {provider.name}
        </button>
      ))}
    </StyledSigninUI>
  );
}

const StyledSigninUI = styled.div`
  display: flex;
  row-gap: 12px;
  justify-content: center;
  align-items: center;
  margin: -30px -20px -150px;
  height: 100vh;
  button {
    display: flex;
    align-items: center;
    background-color: var(--secondary-background);
    padding: 12px 24px;
    column-gap: 12px;
    border-radius: 4px;
    &:before {
      display: block;
      content: '';
      width: 20px;
      height: 20px;
      background-image: url(/images/icons/google.svg);
      background-size: 100%;
    }
    &:hover {
      background-color: var(--secondary-color);
    }
  }
`;
