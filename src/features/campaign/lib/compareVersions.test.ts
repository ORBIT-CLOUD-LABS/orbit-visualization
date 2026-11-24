import { describe, expect, it } from 'vitest';

import { compareVersions } from './compareVersions';

describe('compareVersions', () => {
  it('자리마다 숫자로 비교한다', () => {
    expect(compareVersions('1.0.10', '1.0.9')).toBeGreaterThan(0);
    expect(compareVersions('1.0.9', '1.1')).toBeLessThan(0);
  });

  it('빈 자리는 0 으로 본다', () => {
    expect(compareVersions('1.0', '1.0.0')).toBe(0);
  });
});
