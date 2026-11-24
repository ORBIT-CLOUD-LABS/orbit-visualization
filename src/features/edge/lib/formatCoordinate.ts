const COORDINATE_DIGITS = 4;

/** `위도, 경도` 를 소수점 4자리로. 예: `37.5665, 126.9780` */
export function formatCoordinate(latitude: number, longitude: number): string {
  return `${latitude.toFixed(COORDINATE_DIGITS)}, ${longitude.toFixed(COORDINATE_DIGITS)}`;
}
