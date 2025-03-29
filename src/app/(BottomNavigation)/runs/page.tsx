'use client';

import { useRunStore } from '@/stores/run';
import { useUserStore } from '@/stores/user';
import { IRun } from '@/types/runs';
import request from '@/utils/request';
import { useCallback, useEffect } from 'react';

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
    <div>
      <div>Runs</div>
      <div className="run-list">
        {runStore.map((item) => {
          return (
            <div className="run-item" key={item.uuid}>
              {item.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
