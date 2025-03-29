'use client';

import { useTrackerStore } from '@/stores/tracker';
import Link from 'next/link';
import styled from 'styled-components';

export default function BottomNavigation() {
  const { trackingStatus } = useTrackerStore();

  return (
    <StyledBottomNavigation data-tracking-status={trackingStatus}>
      <div className="center">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/tracker">Tracker</Link>
        <Link href="/runs">Runs</Link>
        <Link href="/mypage">Mypage</Link>
      </div>
    </StyledBottomNavigation>
  );
}

const StyledBottomNavigation = styled.nav`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  transform: translateY(100px);
  transition: transform 500ms;
  .center {
    max-width: 768px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    border-top: 1px solid #ddd;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      width: 100%;
      background-color: #f7f7f7;
    }
  }
  &[data-tracking-status='idle'] {
    transform: translateY(0px);
  }
`;
