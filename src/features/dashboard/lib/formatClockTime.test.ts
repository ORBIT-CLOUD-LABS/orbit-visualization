import { describe, expect, it } from 'vitest';

import { formatClockTime } from './formatClockTime';

describe('formatClockTime', () => {
  it('로컬 시간을 24시간 HH:mm:ss 로 바꾼다', () => {
    expect(formatClockTime(new Date(2026, 10, 24, 9, 5, 7))).toBe('09:05:07');
    expect(formatClockTime(new Date(2026, 10, 24, 21, 30, 0).getTime())).toBe('21:30:00');
  });

  it('ISO 문자열도 로컬 시간으로 바꾼다', () => {
    const iso = new Date(2026, 10, 24, 10, 0, 30).toISOString();

    expect(formatClockTime(iso)).toBe('10:00:30');
  });

  it('날짜 형식이 아니면 null 을 돌려준다', () => {
    expect(formatClockTime('not-a-date')).toBeNull();
  });
});
