import type { LatLng } from './latLng';

/** 남서쪽·북동쪽 모서리. Leaflet 의 LatLngBoundsLiteral 에 그대로 넘길 수 있다 */
export type MapBounds = [southWest: LatLng, northEast: LatLng];

/** 모든 좌표를 담는 가장 작은 범위. 좌표가 없으면 null */
export function computeMapBounds(positions: readonly LatLng[]): MapBounds | null {
  const [first, ...rest] = positions;
  if (first === undefined) {
    return null;
  }
  let [south, west] = first;
  let [north, east] = first;
  for (const [latitude, longitude] of rest) {
    south = Math.min(south, latitude);
    north = Math.max(north, latitude);
    west = Math.min(west, longitude);
    east = Math.max(east, longitude);
  }
  return [
    [south, west],
    [north, east],
  ];
}
