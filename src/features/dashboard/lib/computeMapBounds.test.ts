import { describe, expect, it } from 'vitest';

import { computeMapBounds } from './computeMapBounds';

describe('computeMapBounds', () => {
  it('모든 좌표를 담는 남서·북동 모서리를 돌려준다', () => {
    expect(
      computeMapBounds([
        [37.5, 127],
        [35.1, 129],
        [36.3, 126.5],
      ]),
    ).toEqual([
      [35.1, 126.5],
      [37.5, 129],
    ]);
  });

  it('좌표가 하나면 그 점이 범위다', () => {
    expect(computeMapBounds([[37.5, 127]])).toEqual([
      [37.5, 127],
      [37.5, 127],
    ]);
  });

  it('좌표가 없으면 null', () => {
    expect(computeMapBounds([])).toBeNull();
  });
});
