'use client';

import Button from '@/components/common/Button';
import RunDetail from '@/components/runs/RunDetail';
import { useRunStore } from '@/stores/run';
import { useGlobalSpinner } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { IRun } from '@/types/runs';
import request from '@/utils/request';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

interface IProps {
  run: IRun;
}

export default function RunDetailPage({ run }: IProps) {
  const { setPending } = useGlobalSpinner();
  const [title, setTitle] = useState<string>(run.title);
  const { data: userStore } = useUserStore();
  const { fetch: fetchRuns } = useRunStore();
  const router = useRouter();

  // 기록 저장
  const handleRegistRun = useCallback(async () => {
    if (!confirm('기록을 저장하시겠습니까?')) return;

    setPending(true);

    try {
      const { code } = await request({
        method: 'PUT',
        url: `/api/runs/${run.uuid}`,
        body: {
          title,
        },
      });

      if (code === 200) {
        if (userStore !== null) {
          fetchRuns(userStore?.uuid);
        }
        router.refresh();
      }
    } catch {
      alert('저장 실패, 다시 시도해주세요.');
    } finally {
      setPending(false);
    }
  }, [setPending, run.uuid, title, userStore, router, fetchRuns]);

  // 기록 삭제
  const handleDeleteRun = useCallback(async () => {
    if (!confirm('기록을 삭제하시겠습니까?')) return;

    setPending(true);

    try {
      const { code } = await request({
        method: 'DELETE',
        url: `/api/runs/${run.uuid}`,
      });

      if (code === 200) {
        if (userStore !== null) {
          fetchRuns(userStore?.uuid);
        }
        router.push('/runs');
      }
    } catch {
      alert('삭제 실패, 다시 시도해주세요.');
    } finally {
      setPending(false);
    }
  }, [fetchRuns, router, run.uuid, setPending, userStore]);

  return (
    <StyledRunDetailPage>
      <RunDetail
        uuid={run.uuid}
        startedAt={new Date(run.started_at)}
        endedAt={new Date(run.ended_at)}
        duration={run.duration}
        distance={run.distance}
        route={run.route}
        title={title}
        setTitle={setTitle}
      />
      <section className="bottom-button-area">
        <Button color="black" onClick={handleDeleteRun}>
          삭제하기
        </Button>
        <Button color="primary" onClick={handleRegistRun}>
          저장하기
        </Button>
      </section>
    </StyledRunDetailPage>
  );
}

const StyledRunDetailPage = styled.div`
  padding: 24px 12px 96px;
  display: grid;
  row-gap: 24px;
  .bottom-button-area {
    display: flex;
    column-gap: 12px;
  }
`;
