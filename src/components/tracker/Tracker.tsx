import TrackerButton from '@/components/tracker/Button';
import { useTrackerStore } from '@/stores/tracker';
import { Roboto } from '@/styles/fonts';
import { color } from '@/styles/variable';
import { TLatLng, TTrackingStatus } from '@/types/tracker';
import {
  formatDuration,
  getDistanceFromLatLonInMeters,
  getPace,
  getTotalDistance,
} from '@/utils/distance';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from 'react-leaflet';
import styled from 'styled-components';

type GpsStatus = 'idle' | 'requesting' | 'acquired' | 'error';

const MapCenterSetter = ({ center }: { center: TLatLng }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

const RunningMarker = ({
  lastSegmentsPosition,
  currentPosition,
  initialPosition,
  status,
}: {
  lastSegmentsPosition?: TLatLng | null;
  currentPosition: TLatLng | null;
  initialPosition: TLatLng;
  status: TTrackingStatus;
}) => {
  const map = useMap();
  const position = (
    ['idle', 'paused'].includes(status)
      ? currentPosition || initialPosition
      : lastSegmentsPosition
  ) as TLatLng;

  useEffect(() => {
    map.setView(position, 16); // 사용자의 위치 중심으로 이동
  }, [position, map]);

  return (
    <Marker
      position={position}
      icon={divIcon({
        className: 'marker-icon',
        html: `<div class="marker-icon" data-status="${status}" />`,
        iconSize: [16, 16],
      })}
    />
  );
};

const MIN_MOVE_DISTANCE = 5;
const MAX_ACCURACY = 30;

export default function Tracker() {
  const {
    trackingStatus,
    setTrackingStatus,
    setStartedAt,
    setEndedAt,
    duration,
    setDuration,
    segments,
    setSegments,
  } = useTrackerStore();
  const [isLock, setIsLock] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle');
  const allPositions = segments.flat();
  const distance = segments.reduce(
    (sum, segment) => sum + getTotalDistance(segment),
    0,
  );
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPositionRef = useRef<TLatLng | null>(null);
  const hasStartedTracking = useRef(false); // 최초 위치 도착 여부
  const [currentPosition, setCurrentPosition] = useState<TLatLng | null>(null);
  const preWatchIdRef = useRef<number | null>(null);
  const initialPosition: TLatLng = [37.5665, 126.978];

  const handleWatchPosition = (pos: GeolocationPosition) => {
    // 최초 1회만 실행, 타이머 실행
    if (!hasStartedTracking.current) {
      hasStartedTracking.current = true;

      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }

    const { latitude, longitude, accuracy } = pos.coords;

    if (accuracy > MAX_ACCURACY) return;

    const latlng: TLatLng = [latitude, longitude];

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
    setStartedAt(new Date());

    // 초기 좌표를 위치 배열에 저장
    setSegments([[currentPosition as TLatLng]]);

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
    setSegments((prev) => [...prev, [currentPosition as TLatLng]]);
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

  const lastSegmentsPosition = allPositions.at(-1) || null;

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
        const latlng: TLatLng = [pos.coords.latitude, pos.coords.longitude];
        setCurrentPosition(latlng);
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
        center={initialPosition}
        zoom={16}
        style={{ height: '100%' }}
        zoomControl={false} // + / - 버튼 제거
        dragging={false} // 🛑 드래그 막기
        scrollWheelZoom={false} // 🛑 마우스 휠 확대/축소 막기
        doubleClickZoom={false} // 🛑 더블클릭 확대 막기
        keyboard={false} // 🛑 키보드 제어 막기
      >
        {currentPosition && <MapCenterSetter center={currentPosition} />}
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <RunningMarker
          lastSegmentsPosition={lastSegmentsPosition}
          currentPosition={currentPosition}
          initialPosition={initialPosition}
          status={trackingStatus}
        />
        {segments.map((segment, i) =>
          segment.length > 1 ? (
            <Polyline key={i} positions={segment} color={color.primary} />
          ) : null,
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
            className="play"
          >
            {gpsStatus !== 'acquired' ? '준비중' : '시작'}
          </TrackerButton>
        )}
        {/* 달리는 중 */}
        {trackingStatus === 'running' && (
          <>
            <TrackerButton
              color="black"
              className={isLock ? 'lock' : 'unlock'}
              onClick={() => setIsLock(!isLock)}
            >
              {isLock ? '잠금' : '잠금해제'}
            </TrackerButton>
            <TrackerButton
              color="black"
              className="pause"
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
            <TrackerButton
              color="black"
              className="stop"
              onClick={stopTracking}
            >
              종료
            </TrackerButton>
            <TrackerButton
              color="primary"
              className="play"
              onClick={resumeTracking}
            >
              계속
            </TrackerButton>
          </>
        )}
      </div>
    </StyledTracker>
  );
}

const StyledTracker = styled.div`
  overflow: hidden;
  position: fixed;
  inset: 0;
  height: 100%;
  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0.6;
    }
    70% {
      transform: translate(-50%, -50%) scale(2.5);
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  .marker-icon {
    width: 16px;
    height: 16px;
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: pulse 2s infinite;
      opacity: 0.6;
      z-index: 1;
    }
    &:after {
      display: block;
      content: '';
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      z-index: 2;
    }
    &[data-status='paused'],
    &[data-status='idle'] {
      &:before {
        background-color: rgba(0, 0, 0, 0.5);
      }
      &:after {
        background-color: #000;
      }
    }
    &[data-status='running'] {
      &:before {
        background-color: rgb(254, 151, 58, 0.5);
      }
      &:after {
        background-color: ${color.primary};
      }
    }
  }
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
