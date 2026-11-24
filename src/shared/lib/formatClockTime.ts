function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** 브라우저 로컬 시간의 `HH:mm:ss` (24시간). 값이 없거나 날짜 형식이 아니면 null */
export function formatClockTime(value: Date | number | string | null): string | null {
  // new Date(null) 은 1970년이 되므로 먼저 거른다
  if (value === null) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
