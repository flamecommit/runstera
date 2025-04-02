'use client';

import GlobalSpinner from '@/components/common/GlobalSpinner';
import PageTitle from '@/components/common/PageTitle';
import { useRunStore } from '@/stores/run';
import { useUserStore } from '@/stores/user';
import { Roboto } from '@/styles/fonts';
import { formatDate } from '@/utils/datetime';
import { formatDuration, getPace } from '@/utils/distance';
import Link from 'next/link';
import { useEffect } from 'react';
import styled from 'styled-components';

export default function RunsPage() {
  const { initialized } = useRunStore();
  const { data: userStore } = useUserStore();
  const {
    data: runStore,
    pending: runsPending,
    fetch: fetchRuns,
  } = useRunStore();

  useEffect(() => {
    if (!initialized && userStore !== null) {
      fetchRuns(userStore?.uuid);
    }
  }, [fetchRuns, initialized, userStore, userStore?.uuid]);

  return (
    <StyledRunsPage>
      <PageTitle>Runs</PageTitle>
      {userStore === null || runsPending ? (
        <GlobalSpinner />
      ) : runStore.length > 0 ? (
        <div className="run-list">
          {runStore.map((item) => {
            return (
              <Link
                href={`/runs/${item.uuid}`}
                className="run-item"
                key={item.uuid}
              >
                <div className="started-at">
                  {formatDate(new Date(item.started_at), 'YYYY-MM-DD')}
                </div>
                <div className="title">{item.title}</div>
                <div className="information">
                  <div className="distance">
                    {(item.distance / 1000).toFixed(2)}km
                  </div>
                  <div className="duration">
                    {getPace(item.distance, item.duration)}
                  </div>
                  <div className="duration">
                    {formatDuration(item.duration)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="run-empty">No Data</div>
      )}
    </StyledRunsPage>
  );
}

const StyledRunsPage = styled.div`
  padding: 24px;
  .run-list {
    display: grid;
    row-gap: 36px;
    .run-item {
      border-left: 2px solid #ddd;
      padding: 0 0 0 12px;
      .started-at {
        color: #999;
        font-style: italic;
      }
      .title {
        font-weight: 700;
        font-size: 22px;
        line-height: 120%;
      }
      .information {
        display: flex;
        column-gap: 24px;
        margin-top: 4px;
        div {
          font-weight: 700;
          font-size: 18px;
          font-style: italic;
          font-family: ${Roboto};
        }
      }
    }
  }
  .run-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 160px;
    background-color: #f7f7f7;
  }
`;
