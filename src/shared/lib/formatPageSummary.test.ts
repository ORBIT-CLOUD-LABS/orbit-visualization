import { describe, expect, it } from 'vitest';

import { formatPageSummary } from './formatPageSummary';

describe('formatPageSummary', () => {
  it('전체 수와 지금 범위, 페이지를 세는 단위와 함께 쓴다', () => {
    expect(
      formatPageSummary(
        { page: 2, pageCount: 3, totalCount: 45, rangeStart: 21, rangeEnd: 40 },
        '대',
      ),
    ).toBe('45대 중 21–40 · 2 / 3 페이지');
  });

  it('항목이 없으면 범위를 0 으로 쓴다', () => {
    expect(
      formatPageSummary({ page: 1, pageCount: 1, totalCount: 0, rangeStart: 0, rangeEnd: 0 }, '건'),
    ).toBe('0건 중 0–0 · 1 / 1 페이지');
  });
});
