// 캠페인 기간은 UTC 로 입력받으므로 화면의 시각도 모두 UTC 로 쓴다

/** ISO 시각을 UTC 날짜로. 예: "2026-10-28" */
export function formatUtcDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

/** ISO 시각을 UTC 날짜와 분까지. 예: "2026-10-28 09:00" */
export function formatUtcDateTime(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16).replace('T', ' ');
}
