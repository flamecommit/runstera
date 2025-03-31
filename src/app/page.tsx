'use client';

import { signIn } from 'next-auth/react';
import styled from 'styled-components';

export default function RootPage() {
  return (
    <StyledRootPage>
      <div className="app-name">Runstera</div>
      <div className="button-area">
        <button
          className="btn-signin"
          type="button"
          onClick={() => signIn('google')}
        >
          Sign inwith Google
        </button>
      </div>
    </StyledRootPage>
  );
}

const StyledRootPage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 24px;
  background-image: url(/images/home-background.webp);
  background-position: center;
  background-size: cover;
  .app-name {
    position: absolute;
    right: 0;
    top: 24%;
    left: 0;
    font-weight: 700;
    font-size: 60px;
    text-align: center;
    color: #fff;
    text-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  }
  .button-area {
    position: absolute;
    right: 0;
    bottom: 24%;
    left: 0;
    display: flex;
    justify-content: center;
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
