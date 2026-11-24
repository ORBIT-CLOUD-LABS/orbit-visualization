// 캠페인 기간은 UTC 로 입력받으므로 화면의 시각도 모두 UTC 로 쓴다

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** ISO 시각을 UTC 날짜로. 예: "2026-10-28" */
export function formatUtcDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** ISO 시각을 UTC 날짜와 분까지. 예: "2026-10-28 09:00" */
export function formatUtcDateTime(iso: string): string {
  const date = new Date(iso);
  return `${formatUtcDate(iso)} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}
