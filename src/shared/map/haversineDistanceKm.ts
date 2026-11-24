import type { LatLng } from './latLng';

/** 지구 평균 반지름(km) */
const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** 두 좌표 사이의 대원 거리(km). 지구를 구로 보고 하버사인 공식으로 계산한다 */
export function haversineDistanceKm([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  // 부동소수 오차로 1 을 조금 넘으면 asin 이 NaN 이 되므로 자른다
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}
