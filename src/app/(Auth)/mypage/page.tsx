'use client';

import PageTitle from '@/components/common/PageTitle';
import { useGlobalSpinner } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import request from '@/utils/request';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import styled from 'styled-components';

export default function MypagePage() {
  const { data: userStore, setData: setUser } = useUserStore();
  const { setPending } = useGlobalSpinner();

  const handleSignout = () => {
    setUser(null);
    signOut({ callbackUrl: '/' });
  };

  const handleWithdrawal = async () => {
    if (
      !confirm(
        '회원탈퇴시 러닝정보를 포함한 모든 데이터가 삭제되며 복구가 불가능합니다. 회원탈퇴를 진행하시겠습니까?',
      )
    )
      return;

    setPending(true);

    try {
      const { code } = await request({
        method: 'DELETE',
        url: `/api/user/${userStore?.uuid}`,
      });

      if (code === 200) {
        setUser(null);
        signOut({ callbackUrl: '/' });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <StyledMypagePage>
      <PageTitle>Mypage</PageTitle>
      <div className="mypage-list">
        <div className="row">
          <Link href="/policy/terms">이용약관</Link>
        </div>
        <div className="row">
          <Link href="/policy/privacy">개인정보처리방침</Link>
        </div>
        <div className="row">
          <Link href="/policy/location">위치정보 이용 안내</Link>
        </div>
        <div className="row">
          <button type="button" onClick={handleSignout}>
            로그아웃
          </button>
        </div>
        <div className="row">
          <button
            type="button"
            className="withdrawal"
            onClick={handleWithdrawal}
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </StyledMypagePage>
  );
}

const StyledMypagePage = styled.div`
  padding: 24px;
  .mypage-list {
    display: grid;
    .row {
      border-bottom: 1px solid #ddd;
      a,
      button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 0;
        width: 100%;
        height: 48px;
        text-align: left;
        font-weight: 700;
        font-size: 16px;
        &:after {
          display: block;
          content: '';
          width: 30px;
          height: 30px;
          mask-image: url(/images/icons/right.svg);
          mask-position: center;
          mask-size: 24px;
          background-color: #000;
        }
        &.withdrawal {
          color: #999;
        }
      }
    }
  }
`;
