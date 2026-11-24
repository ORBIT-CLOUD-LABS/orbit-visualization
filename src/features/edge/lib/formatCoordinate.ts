const COORDINATE_DIGITS = 4;

function formatDegree(value: number): string {
  const text = value.toFixed(COORDINATE_DIGITS);
  // 0 에 아주 가까운 음수는 반올림 뒤에도 부호가 남아 -0.0000 이 된다
  return Number(text) === 0 ? (0).toFixed(COORDINATE_DIGITS) : text;
}

/** `위도, 경도` 를 소수점 4자리로. 예: `37.5665, 126.9780` */
export function formatCoordinate(latitude: number, longitude: number): string {
  return `${formatDegree(latitude)}, ${formatDegree(longitude)}`;
}
