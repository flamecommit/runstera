'use client';

import PageTitle from '@/components/common/PageTitle';
import { signOut } from 'next-auth/react';
import styled from 'styled-components';

export default function MypagePage() {
  return (
    <StyledMypagePage>
      <PageTitle>Mypage</PageTitle>
      <div className="mypage-list">
        <div className="row">
          <button type="button" onClick={() => signOut()}>
            Sign Out
          </button>
        </div>
      </div>
    </StyledMypagePage>
  );
}

const StyledMypagePage = styled.div`
  padding: 24px;
  .mypage-list {
    border-top: 1px solid #ddd;
    margin-inline: -24px;
    .row {
      border-bottom: 1px solid #ddd;
      a,
      button {
        display: flex;
        align-items: center;
        padding-inline: 24px;
        width: 100%;
        height: 48px;
        text-align: left;
        font-weight: 700;
        font-size: 16px;
      }
    }
  }
`;
