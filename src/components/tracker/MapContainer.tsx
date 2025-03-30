'use client';

import { color } from '@/styles/variable';
import { TLatLng } from '@/types/tracker';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';

interface IProps {
  segments: TLatLng[][];
}

// 좌표의 중심값 구하기
const getCenterFromSegments = (segments: TLatLng[][]): TLatLng => {
  const allPoints = segments.flat();
  if (allPoints.length === 0) return [37.5665, 126.978];

  const [latSum, lngSum] = allPoints.reduce(
    ([latAcc, lngAcc], [lat, lng]) => [latAcc + lat, lngAcc + lng],
    [0, 0],
  );

  const count = allPoints.length;
  return [latSum / count, lngSum / count];
};

export default function MapContainerNoSSR({ segments }: IProps) {
  return (
    <MapContainer
      center={getCenterFromSegments(segments)}
      zoom={16}
      style={{ height: 300 }}
      zoomControl={false} // + / - 버튼 제거
      scrollWheelZoom={false} // 🛑 마우스 휠 확대/축소 막기
      doubleClickZoom={false} // 🛑 더블클릭 확대 막기
      keyboard={false} // 🛑 키보드 제어 막기
      dragging={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      {segments.map((segment, i) =>
        segment.length > 1 ? (
          <Polyline key={i} positions={segment} color={color.primary} />
        ) : null,
      )}
    </MapContainer>
  );
}
