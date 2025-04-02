'use client';

import { useUserStore } from '@/stores/user';
import styled from 'styled-components';

export default function UserStatus() {
  const { data: userStore } = useUserStore();

  return (
    <StyledUserStatus>
      <div>{userStore?.uuid}</div>
      <div>{userStore?.name}</div>
      <div>{userStore?.email}</div>
      <div>{userStore?.image}</div>
    </StyledUserStatus>
  );
}

const StyledUserStatus = styled.div`
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 30000;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 12px;
  width: 200px;
`;
