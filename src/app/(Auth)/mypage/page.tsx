'use client';

import PageTitle from '@/components/common/PageTitle';
import { useGlobalSpinner } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import request from '@/utils/request';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

export default function MypagePage() {
  const { data: userStore, setData: setUser } = useUserStore();
  const { setPending } = useGlobalSpinner();
  const router = useRouter();

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
        await signOut({ redirect: false });
        setUser(null);
        router.push('/');
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
    row-gap: 12px;
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
        &.withdrawal {
          color: red;
        }
      }
    }
  }
`;
