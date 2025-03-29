export function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // 지구 반지름 (단위: m)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 이동 거리 구하기
export function getTotalDistance(path: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    const [lat1, lon1] = path[i - 1];
    const [lat2, lon2] = path[i];
    total += getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2);
  }
  return total; // 단위: 미터
}

// 평균 페이스
export function getPace(
  distanceInMeters: number,
  durationInSeconds: number,
): string {
  if (distanceInMeters === 0) return '0\'00"';

  const paceInSecondsPerKm = durationInSeconds / (distanceInMeters / 1000);
  const minutes = Math.floor(paceInSecondsPerKm / 60);
  const seconds = Math.round(paceInSecondsPerKm % 60);

  return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
}

// second => 00:00
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const padded = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${padded(hrs)}:${padded(mins)}:${padded(secs)}`;
  } else {
    return `${padded(mins)}:${padded(secs)}`;
  }
}
