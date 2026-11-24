import { describe, expect, it } from 'vitest';

import { formatTimestamp } from './formatTimestamp';

describe('formatTimestamp', () => {
  it('브라우저 시간대의 날짜와 초까지 쓴다', () => {
    // 테스트를 돌리는 곳의 시간대와 상관없도록 로컬 시각으로 만든다
    const iso = new Date(2026, 9, 8, 9, 5, 7).toISOString();

    expect(formatTimestamp(iso)).toBe('2026-10-08 09:05:07');
  });
});
