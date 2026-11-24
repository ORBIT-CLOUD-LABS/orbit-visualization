import { describe, expect, it } from 'vitest';

import { formatDate, formatDateTime } from './formatDateTime';

// 테스트를 돌리는 곳의 시간대와 상관없도록 브라우저 시간대 기준으로 만든 시각을 쓴다
const localIso = new Date(2026, 9, 8, 9, 5).toISOString();

describe('formatDateTime', () => {
  it('날짜만 쓴다', () => {
    expect(formatDate(localIso)).toBe('2026-10-08');
  });

  it('날짜와 분까지 쓴다', () => {
    expect(formatDateTime(localIso)).toBe('2026-10-08 09:05');
  });
});
