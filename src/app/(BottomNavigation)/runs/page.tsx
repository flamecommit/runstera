'use client';

import { useRunStore } from '@/stores/run';
import { useUserStore } from '@/stores/user';
import { Roboto } from '@/styles/fonts';
import { IRun } from '@/types/runs';
import { formatDate } from '@/utils/datetime';
import { formatDuration, getPace } from '@/utils/distance';
import request from '@/utils/request';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

export default function RunsPage() {
  const { data: userStore } = useUserStore();
  const { data: runStore, setData: setRunStore } = useRunStore();

  const getRunsData = useCallback(async () => {
    try {
      const { code, data } = await request<IRun[]>({
        method: 'GET',
        url: `/api/runs`,
        searchParams: {
          user_uuid: userStore?.uuid,
        },
      });

      if (code === 200) {
        setRunStore(data);
      }
    } catch {
      console.error('error');
    }
  }, [setRunStore, userStore?.uuid]);

  useEffect(() => {
    if (runStore.length === 0) {
      getRunsData();
    }
  }, [getRunsData, runStore.length]);

  return (
    <StyledRunsPage>
      <div className="page-title">Runs</div>
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
                <div className="duration">{formatDuration(item.duration)}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </StyledRunsPage>
  );
}

const StyledRunsPage = styled.div`
  padding: 24px;
  .page-title {
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 24px;
  }
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
`;
