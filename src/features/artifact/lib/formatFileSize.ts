const UNITS = ['B', 'KB', 'MB', 'GB'] as const;
const STEP = 1024;

/** 사람이 읽는 크기. 1024 단위로 나누고 소수 한 자리까지 쓴다. 예: 20,971,520 → "20.0 MB" */
export function formatFileSize(bytes: number): string {
  if (bytes < STEP) {
    return `${bytes} B`;
  }
  let value = bytes;
  let unitIndex = 0;
  while (value >= STEP && unitIndex < UNITS.length - 1) {
    value /= STEP;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${UNITS[unitIndex]}`;
}

/** 정확한 바이트 수. 예: "20,971,520 bytes" */
export function formatByteCount(bytes: number): string {
  return `${bytes.toLocaleString('en-US')} bytes`;
}
