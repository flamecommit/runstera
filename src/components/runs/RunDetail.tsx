'use client';

import Input from '@/components/form/Input';
import { Roboto } from '@/styles/fonts';
import { TLatLng } from '@/types/tracker';
import { formatDate } from '@/utils/datetime';
import { formatDuration, getPace } from '@/utils/distance';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const MapContainerNoSSR = dynamic(
  () => import('@/components/tracker/MapContainer'),
  {
    ssr: false,
  },
);

interface IProps {
  uuid?: string;
  startedAt: Date | null;
  endedAt: Date | null;
  duration: number;
  distance: number;
  route: TLatLng[][];
  title: string;
  setTitle: (value: string) => void;
  onSuccess?: () => void;
}

export default function RunDetail({
  startedAt,
  endedAt,
  duration,
  distance,
  route,
  title,
  setTitle,
}: IProps) {
  return (
    <StyledRunDetail>
      <section>
        <div className="label">제목</div>
        <Input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </section>
      <section>
        <div className="label">시작 시간</div>
        <div className="value-s">
          {formatDate(startedAt, 'YYYY-MM-DD hh:mm:ss')}
        </div>
        <div className="label">종료 시간</div>
        <div className="value-s">
          {formatDate(endedAt, 'YYYY-MM-DD hh:mm:ss')}
        </div>
      </section>
      <section className="information">
        <div className="distance">
          <div className="label">거리</div>
          <div className="value">{(distance / 1000).toFixed(2)}km</div>
        </div>
        <div className="duration">
          <div className="label">페이스</div>
          <div className="value">{getPace(distance, duration)}</div>
        </div>
        <div className="duration">
          <div className="label">시간</div>
          <div className="value">{formatDuration(duration)}</div>
        </div>
      </section>
      <section>
        <MapContainerNoSSR segments={route} />
      </section>
    </StyledRunDetail>
  );
}

const StyledRunDetail = styled.div`
  display: grid;
  row-gap: 24px;
  .title-input {
    height: 48px;
    font-weight: 700;
    font-size: 26px;
    border-width: 0 0 2px;
    border-color: #000;
    padding: 0;
  }
  .datetime {
    font-size: 20px;
  }
  .label {
    color: #999;
  }
  .value {
    font-weight: 700;
    font-size: 24px;
    font-style: italic;
    font-family: ${Roboto};
  }
  .value-s {
    font-weight: 700;
    font-size: 18px;
    font-style: italic;
    font-family: ${Roboto};
  }
  .information {
    display: flex;
    justify-content: space-around;
    column-gap: 24px;
    margin-top: 4px;
    div {
      text-align: center;
    }
  }
`;
