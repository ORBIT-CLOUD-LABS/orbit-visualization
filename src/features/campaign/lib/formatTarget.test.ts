import { describe, expect, it } from 'vitest';

import { formatTargetList, formatVersionRange } from './formatTarget';

describe('formatTargetList', () => {
  it('비어 있으면 전체로 쓴다', () => {
    expect(formatTargetList([])).toBe('전체');
    expect(formatTargetList(['HW1', 'HW2'])).toBe('HW1, HW2');
  });
});

describe('formatVersionRange', () => {
  it.each([
    [null, null, '제한 없음'],
    ['1.0.0', null, '1.0.0 이상'],
    [null, '1.0.9', '1.0.9 이하'],
    ['1.0.0', '1.0.9', '1.0.0 ~ 1.0.9'],
  ])('%s ~ %s 는 "%s"', (min, max, expected) => {
    expect(formatVersionRange(min, max)).toBe(expected);
  });
});
