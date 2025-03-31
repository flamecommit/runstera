'use client';

import PageTitle from '@/components/common/PageTitle';
import { useUserStore } from '@/stores/user';
import { signOut } from 'next-auth/react';
import styled from 'styled-components';

export default function MypagePage() {
  const { setData: setUser } = useUserStore();

  const handleSignout = () => {
    setUser(null);
    signOut();
  };

  return (
    <StyledMypagePage>
      <PageTitle>Mypage</PageTitle>
      <div className="mypage-list">
        <div className="row">
          <button type="button" onClick={handleSignout}>
            로그아웃
          </button>
        </div>
      </div>
    </StyledMypagePage>
  );
}

const StyledMypagePage = styled.div`
  padding: 24px;
  .mypage-list {
    .row {
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
        border-left: 2px solid #ddd;
      }
    }
  }
`;
