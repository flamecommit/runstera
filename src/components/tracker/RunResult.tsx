'use client';

import Input from '@/components/form/Input';
import { useTrackerStore } from '@/stores/tracker';
import { useGlobalSpinner } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { formatDate } from '@/utils/datetime';
import { getTotalDistance } from '@/utils/distance';
import request from '@/utils/request';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

const MapContainerNoSSR = dynamic(
  () => import('@/components/tracker/MapContainer'),
  {
    ssr: false,
  },
);

export default function RunResult() {
  const { data: user } = useUserStore();
  const { setPending } = useGlobalSpinner();
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
    `${formatDate(startedAt, 'YYYY-MM-DD hh:mm')} 달리기`,
  );
  const distance = segments.reduce(
    (sum, segment) => sum + getTotalDistance(segment),
    0,
  );

  // 기록 저장
  const handleRegistRun = useCallback(async () => {
    if (!confirm('기록을 저장하시겠습니까?')) return;

    setPending(true);

    try {
      const { code } = await request({
        method: 'POST',
        url: `/api/runs`,
        body: {
          user_uuid: user?.uuid,
          startedAt,
          endedAt,
          title,
          duration,
          route: segments,
          distance,
        },
      });

      if (code === 200) {
        alert('저장 성공');
        setTrackingStatus('idle');
        setStartedAt(null);
        setEndedAt(null);
        setDuration(0);
        setSegments([]);
      }
    } catch {
      alert('저장 실패, 다시 시도해주세요.');
    } finally {
      setPending(false);
    }
  }, [
    distance,
    duration,
    endedAt,
    segments,
    setDuration,
    setEndedAt,
    setPending,
    setSegments,
    setStartedAt,
    setTrackingStatus,
    startedAt,
    title,
    user?.uuid,
  ]);

  return (
    <StyledRunResult>
      <div>
        <div>duration : {duration}s</div>
        <div>distance : {distance}m</div>
      </div>
      <MapContainerNoSSR segments={segments} />
      <table>
        <colgroup>
          <col style={{ width: 120 }} />
          <col style={{ width: 'auto' }} />
        </colgroup>
        <tbody>
          <tr>
            <th>제목</th>
            <td>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button type="button" onClick={handleRegistRun}>
          저장하기
        </button>
      </div>
    </StyledRunResult>
  );
}

const StyledRunResult = styled.div``;
