import { describe, expect, it } from 'vitest';

import { formatUtcDate, formatUtcDateTime } from './formatUtc';

describe('formatUtc', () => {
  it('브라우저 시간대와 상관없이 UTC 날짜를 쓴다', () => {
    expect(formatUtcDate('2026-10-27T23:30:00Z')).toBe('2026-10-27');
  });

  it('UTC 날짜와 분까지 쓴다', () => {
    expect(formatUtcDateTime('2026-10-27T09:05:59Z')).toBe('2026-10-27 09:05');
  });
});
