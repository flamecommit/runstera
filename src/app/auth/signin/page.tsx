'use client';

import { color } from '@/styles/variable';
import { signIn } from 'next-auth/react';
import styled from 'styled-components';

export default function AuthSigninPage() {
  return (
    <StyledAuthSigninPage>
      <div className="button-area">
        <button
          className="btn-signin"
          type="button"
          onClick={() => signIn('google', { callbackUrl: `/auth/callback` })}
        >
          Sign in with Google
        </button>
      </div>
    </StyledAuthSigninPage>
  );
}

const StyledAuthSigninPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${color.primary};
  .button-area {
    button {
      display: flex;
      align-items: center;
      padding: 12px 24px;
      width: 240px;
      column-gap: 12px;
      border-radius: 4px;
      border: 1px solid #ddd;
      background-color: #fff;
      font-weight: 500;
      font-size: 16px;
      &:before {
        display: block;
        content: '';
        width: 20px;
        height: 20px;
        background-image: url(/images/icons/google.svg);
        background-size: 100%;
      }
      &:hover {
        background-color: #f7f7f7;
      }
    }
  }
`;
