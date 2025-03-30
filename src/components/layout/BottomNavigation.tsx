'use client';

import { useTrackerStore } from '@/stores/tracker';
import { color } from '@/styles/variable';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

export default function BottomNavigation() {
  const { trackingStatus } = useTrackerStore();
  const pathname = usePathname();

  return (
    <StyledBottomNavigation data-tracking-status={trackingStatus}>
      <div className="center">
        {/* <Link href="/dashboard" className="dashboard">
          Dashboard
        </Link> */}
        <Link
          href="/tracker"
          className="tracker"
          data-active={pathname === '/tracker'}
        >
          Tracker
        </Link>
        <Link
          href="/runs"
          className="runs"
          data-active={pathname.startsWith('/runs')}
        >
          Runs
        </Link>
        <Link
          href="/mypage"
          className="mypage"
          data-active={pathname.startsWith('/mypage')}
        >
          Mypage
        </Link>
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
  border-top: 1px solid #ddd;
  background-color: #f7f7f7;
  .center {
    max-width: 768px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      width: 100%;
      font-size: 0;
      &:after {
        display: block;
        content: '';
        width: 36px;
        height: 36px;
        background-color: #000;
        mask-size: 32px;
        mask-position: center;
      }
      &.dashboard:after {
        mask-image: url(/images/icons/dashboard.svg);
      }
      &.tracker:after {
        mask-image: url(/images/icons/tracker.svg);
      }
      &.runs:after {
        mask-image: url(/images/icons/runs.svg);
      }
      &.mypage:after {
        mask-image: url(/images/icons/mypage.svg);
      }
      &[data-active='true']:after {
        background-color: ${color.primary};
      }
    }
  }
  &[data-tracking-status='idle'] {
    transform: translateY(0px);
  }
`;
