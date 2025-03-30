'use client';

import { color } from '@/styles/variable';
import { TLatLng } from '@/types/tracker';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet';

interface IProps {
  segments: TLatLng[][];
}

// 모든 좌표를 flat하게 모아서 bounds 계산
const getBoundsFromSegments = (segments: TLatLng[][]): L.LatLngBounds => {
  const allPoints = segments.flat();
  return L.latLngBounds(allPoints);
};

// Bounds 적용 컴포넌트
const FitBounds = ({ segments }: { segments: TLatLng[][] }) => {
  const map = useMap();
  const bounds = getBoundsFromSegments(segments);

  // bounds 적용
  useEffect(() => {
    if (segments.flat().length > 0) {
      map.fitBounds(bounds, {
        padding: [20, 20], // 여백 추가
        maxZoom: 17, // 너무 확대되지 않도록 제한
      });
    }
  }, [segments, map, bounds]);

  return null;
};

export default function MapContainerNoSSR({ segments }: IProps) {
  const defaultCenter: TLatLng = [37.5665, 126.978]; // fallback center

  return (
    <MapContainer
      center={defaultCenter}
      zoom={16}
      style={{ height: 300 }}
      zoomControl={false} // + / - 버튼 제거
      scrollWheelZoom={false} // 🛑 마우스 휠 확대/축소 막기
      doubleClickZoom={false} // 🛑 더블클릭 확대 막기
      keyboard={false} // 🛑 키보드 제어 막기
      dragging={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <FitBounds segments={segments} />
      {segments.map((segment, i) =>
        segment.length > 1 ? (
          <Polyline key={i} positions={segment} color={color.primary} />
        ) : null,
      )}
    </MapContainer>
  );
}
