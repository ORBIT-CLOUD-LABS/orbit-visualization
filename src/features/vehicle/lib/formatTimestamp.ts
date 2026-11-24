function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** ISO 시각을 브라우저 시간대의 초까지. 예: "2026-10-28 10:00:30" */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
