'use client';

import PageTitle from '@/components/common/PageTitle';
import { useUserStore } from '@/stores/user';
import styled from 'styled-components';

export default function DashboardPage() {
  const { data: user } = useUserStore();

  return (
    <StyledDashboardPage>
      <PageTitle>Dashboard</PageTitle>
      {user !== null && (
        <div>
          <div>name: {user.name}</div>
          <div>name: {user.email}</div>
          <div>
            <img src={user.image} alt="" />
          </div>
        </div>
      )}
    </StyledDashboardPage>
  );
}

const StyledDashboardPage = styled.div`
  padding: 24px;
`;
