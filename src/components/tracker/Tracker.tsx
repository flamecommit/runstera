import TrackerButton from '@/components/tracker/Button';
import { useTrackerStore } from '@/stores/tracker';
import { Roboto } from '@/styles/fonts';
import {
  formatDuration,
  getDistanceFromLatLonInMeters,
  getPace,
  getTotalDistance,
} from '@/utils/distance';
import request from '@/utils/request';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from 'react-leaflet';
import styled from 'styled-components';

type LatLng = [number, number];
type GpsStatus = 'idle' | 'requesting' | 'acquired' | 'error';

const MapCenterSetter = ({ center }: { center: LatLng }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

const LocationMarker = ({ position }: { position: LatLng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 16); // 사용자의 위치 중심으로 이동
  }, [position, map]);

  return (
    <Marker
      position={position}
      icon={divIcon({
        className: 'marker-icon',
        html: '<div style="background: red; border-radius: 50%; width: 16px; height: 16px;" />',
        iconSize: [16, 16],
      })}
    />
  );
};

const MIN_MOVE_DISTANCE = 5;
const MAX_ACCURACY = 30;

export default function Tracker() {
  const { trackingStatus, setTrackingStatus } = useTrackerStore();
  const [isLock, setIsLock] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle');
  const [segments, setSegments] = useState<LatLng[][]>([]);
  const allPositions = segments.flat();
  const distance = segments.reduce(
    (sum, segment) => sum + getTotalDistance(segment),
    0,
  );
  const watchIdRef = useRef<number | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [endedAt, setEndedAt] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPositionRef = useRef<LatLng | null>(null);
  const hasStartedTracking = useRef(false); // 최초 위치 도착 여부
  const [initialPosition, setInitialPosition] = useState<LatLng | null>(null);
  const preWatchIdRef = useRef<number | null>(null);
  const centerPosition: LatLng = [37.5665, 126.978];

  const handleWatchPosition = (pos: GeolocationPosition) => {
    // 최초 1회만 실행, 타이머 실행
    if (!hasStartedTracking.current) {
      hasStartedTracking.current = true;

      setStartedAt(new Date());
      setEndedAt(null);
      setDuration(0);

      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }

    const { latitude, longitude, accuracy } = pos.coords;

    if (accuracy > MAX_ACCURACY) return;

    const latlng: LatLng = [latitude, longitude];

    // 최초 좌표는 저장하지 않음
    if (!lastPositionRef.current) {
      lastPositionRef.current = latlng;
      return;
    }

    // 누적 이동 거리 필터
    const moved = getDistanceFromLatLonInMeters(
      ...lastPositionRef.current,
      ...latlng,
    );

    if (moved < MIN_MOVE_DISTANCE) return;

    lastPositionRef.current = latlng;

    // 위치 저장
    setSegments((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = [...updated[updated.length - 1], latlng];
      return updated;
    });
  };

  // 트래킹 시작
  const startTracking = () => {
    if (!navigator.geolocation) return alert('GPS를 지원하지 않습니다.');

    setIsLock(true);

    // 초기 좌표를 위치 배열에 저장
    setSegments([[initialPosition as LatLng]]);

    hasStartedTracking.current = false;

    const id = navigator.geolocation.watchPosition(
      handleWatchPosition,
      (err) => console.error(err),
      { enableHighAccuracy: true },
    );

    watchIdRef.current = id;
    setTrackingStatus('running');
  };

  // 트래킹 일시정지
  const pauseTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTrackingStatus('paused');
  };

  // 트래킹 재시작
  const resumeTracking = async () => {
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleWatchPosition,
      (err) => console.error(err),
      { enableHighAccuracy: true },
    );
    intervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    setSegments((prev) => [...prev, []]);
    setIsLock(true);
    setTrackingStatus('running');
  };

  // 트래킹 종료
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setEndedAt(new Date());

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      lastPositionRef.current = null;
      intervalRef.current = null;
    }
    setTrackingStatus('finished');
  };

  const currentPosition: LatLng = allPositions.at(-1) ?? [37.5665, 126.978];

  // 기록 저장
  const handleRegistRun = useCallback(async () => {
    try {
      const { code } = await request({
        method: 'POST',
        url: `/api/runs`,
        body: {
          startedAt,
          endedAt,
          route: segments,
          distance,
        },
      });

      if (code === 200) {
        alert('저장 성공');
      }
    } finally {
      setTrackingStatus('idle');
    }
  }, [distance, endedAt, segments, startedAt, setTrackingStatus]);

  useEffect(() => {
    if (trackingStatus === 'finished' && startedAt && endedAt) {
      // 종료
      if (!confirm('기록을 저장하시겠습니까?')) {
        return setTrackingStatus('idle');
      }

      handleRegistRun();
    }
  }, [endedAt, handleRegistRun, startedAt, trackingStatus, setTrackingStatus]);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('이 브라우저는 GPS를 지원하지 않습니다.');
      setGpsStatus('error');
      return;
    }

    setGpsStatus('requesting');

    // 위치 권한 요청 및 초기 위치 트래킹 시작
    preWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const latlng: LatLng = [pos.coords.latitude, pos.coords.longitude];
        setInitialPosition(latlng);
        setGpsStatus('acquired');
      },
      (err) => {
        console.error(err);
        setGpsStatus('error');
      },
      { enableHighAccuracy: true },
    );

    // 언마운트 시 watch 제거
    return () => {
      if (preWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(preWatchIdRef.current);
      }
    };
  }, []);

  return (
    <StyledTracker>
      <MapContainer
        center={centerPosition}
        zoom={16}
        style={{ height: '100%' }}
        zoomControl={false} // + / - 버튼 제거
        dragging={false} // 🛑 드래그 막기
        scrollWheelZoom={false} // 🛑 마우스 휠 확대/축소 막기
        doubleClickZoom={false} // 🛑 더블클릭 확대 막기
        keyboard={false} // 🛑 키보드 제어 막기
      >
        {initialPosition && <MapCenterSetter center={initialPosition} />}

        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {initialPosition && trackingStatus === 'idle' && (
          <Marker
            position={initialPosition}
            icon={divIcon({
              className: 'marker-icon',
              html: '<div style="background: blue; border-radius: 50%; width: 16px; height: 16px;" />',
              iconSize: [16, 16],
            })}
          />
        )}
        {allPositions.length > 0 && trackingStatus !== 'idle' && (
          <LocationMarker position={currentPosition} />
        )}
        {segments.map((segment, i) =>
          segment.length > 1 ? <Polyline key={i} positions={segment} /> : null,
        )}
      </MapContainer>

      {trackingStatus !== 'idle' && (
        <div className="dashboard">
          <div className="pace">{getPace(distance, duration)}</div>
          {/* 달린 시간 */}
          <div className="duration">{formatDuration(duration)}</div>
          {/* 달린 거리 */}
          <div className="distance">{(distance / 1000).toFixed(2)}km</div>
        </div>
      )}

      <div className="tracker-button-area">
        {/* 시작 전 */}
        {trackingStatus === 'idle' && (
          <TrackerButton
            color="primary"
            disabled={gpsStatus !== 'acquired'}
            onClick={startTracking}
          >
            {gpsStatus !== 'acquired' ? '준비중' : '시작'}
          </TrackerButton>
        )}
        {/* 달리는 중 */}
        {trackingStatus === 'running' && (
          <>
            <TrackerButton color="black" onClick={() => setIsLock(!isLock)}>
              {isLock ? '잠금' : '잠금해제'}
            </TrackerButton>
            <TrackerButton
              color="black"
              disabled={isLock}
              onClick={pauseTracking}
            >
              일시정지
            </TrackerButton>
          </>
        )}
        {/* 일시정지 */}
        {trackingStatus === 'paused' && (
          <>
            <TrackerButton color="black" onClick={stopTracking}>
              종료
            </TrackerButton>
            <TrackerButton color="primary" onClick={resumeTracking}>
              계속
            </TrackerButton>
          </>
        )}
      </div>
    </StyledTracker>
  );
}

const StyledTracker = styled.div`
  position: absolute;
  inset: 0;
  height: 100%;
  .tracker-button-area {
    position: absolute;
    bottom: 12%;
    right: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    gap: 24px;
  }
  .dashboard {
    font-family: ${Roboto};
    font-weight: 700;
    font-style: italic;
    .pace {
      position: absolute;
      top: 30px;
      left: 30px;
      z-index: 1000;
      font-size: 30px;
      letter-spacing: -0.02em;
    }
    .duration {
      position: absolute;
      top: 30px;
      right: 30px;
      z-index: 1000;
      font-size: 30px;
      letter-spacing: -0.02em;
    }
    .distance {
      position: absolute;
      bottom: 28%;
      right: 0;
      left: 0;
      z-index: 1000;
      text-align: center;
      font-size: 72px;
      letter-spacing: -0.04em;
    }
  }
`;
