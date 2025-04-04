'use client';

import Button from '@/components/common/Button';
import RunDetail from '@/components/runs/RunDetail';
import { useRunStore } from '@/stores/run';
import { useTrackerStore } from '@/stores/tracker';
import { useGlobalSpinner } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { formatDate, getTimeOfDay } from '@/utils/datetime';
import { getTotalDistance } from '@/utils/distance';
import request from '@/utils/request';
import { useDialog } from '@shinyongjun/react-dialog';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

export default function RunResult() {
  const { data: userStore } = useUserStore();
  const { setPending } = useGlobalSpinner();
  const { fetch: fetchRuns } = useRunStore();
  const {
    startedAt,
    endedAt,
    duration,
    segments,
    setStartedAt,
    setEndedAt,
    setDuration,
    setSegments,
    setTrackingStatus,
  } = useTrackerStore();
  const [title, setTitle] = useState<string>(
    `${formatDate(startedAt, 'YYYY-MM-DD')} ${getTimeOfDay(
      startedAt as Date,
    )} 달리기`,
  );
  const distance = segments.reduce(
    (sum, segment) => sum + getTotalDistance(segment),
    0,
  );
  const router = useRouter();
  const { alert, confirm } = useDialog();

  // 기록 저장
  const handleRegistResult = useCallback(async () => {
    setPending(true);

    try {
      const { code } = await request({
        method: 'POST',
        url: `/api/runs`,
        body: {
          user_uuid: userStore?.uuid,
          startedAt,
          endedAt,
          title,
          duration,
          route: segments,
          distance,
        },
      });

      if (code === 200) {
        if (userStore !== null) {
          fetchRuns(userStore.uuid);
        }
        setTrackingStatus('idle');
        setStartedAt(null);
        setEndedAt(null);
        setDuration(0);
        setSegments([]);

        router.push('/runs');
      }
    } catch {
      await alert('저장 실패, 다시 시도해주세요.');
    } finally {
      setPending(false);
    }
  }, [
    alert,
    distance,
    duration,
    endedAt,
    fetchRuns,
    router,
    segments,
    setDuration,
    setEndedAt,
    setPending,
    setSegments,
    setStartedAt,
    setTrackingStatus,
    startedAt,
    title,
    userStore,
  ]);

  const handleDeleteResult = async () => {
    if (!(await confirm('기록을 삭제하시겠습니까?'))) return;

    setTrackingStatus('idle');
    setStartedAt(null);
    setEndedAt(null);
    setDuration(0);
    setSegments([]);

    router.push('/tracker');
  };

  return (
    <StyledRunResult>
      <RunDetail
        startedAt={startedAt}
        endedAt={endedAt}
        duration={duration}
        distance={distance}
        route={segments}
        title={title}
        setTitle={setTitle}
      />
      <section className="bottom-button-area">
        <Button color="black" onClick={handleDeleteResult}>
          삭제하기
        </Button>
        <Button color="primary" onClick={handleRegistResult}>
          저장하기
        </Button>
      </section>
    </StyledRunResult>
  );
}

const StyledRunResult = styled.div`
  padding: 24px 12px 96px;
  display: grid;
  row-gap: 24px;
  .bottom-button-area {
    display: flex;
    column-gap: 12px;
  }
`;
