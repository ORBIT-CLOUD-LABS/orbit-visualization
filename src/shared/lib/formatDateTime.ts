function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function datePart(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function minutePart(date: Date): string {
  return `${datePart(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** ISO 시각을 브라우저 시간대의 날짜로. 예: "2026-10-28" */
export function formatDate(iso: string): string {
  return datePart(new Date(iso));
}

/** ISO 시각을 브라우저 시간대의 날짜와 분까지. 예: "2026-10-28 09:00" */
export function formatDateTime(iso: string): string {
  return minutePart(new Date(iso));
}

/** ISO 시각을 브라우저 시간대의 초까지. 예: "2026-10-28 10:00:30" */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return `${minutePart(date)}:${pad(date.getSeconds())}`;
}
