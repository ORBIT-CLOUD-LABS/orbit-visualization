function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** ISO 시각을 브라우저 시간대의 날짜로. 예: "2026-10-28" */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** ISO 시각을 브라우저 시간대의 날짜와 분까지. 예: "2026-10-28 09:00" */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return `${formatDate(iso)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
