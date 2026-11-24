import { describe, expect, it } from 'vitest';

import { formatCoordinate } from './formatCoordinate';

describe('formatCoordinate', () => {
  it('위도·경도를 소수점 4자리로 맞춰 쉼표로 잇는다', () => {
    expect(formatCoordinate(37.5665, 126.978)).toBe('37.5665, 126.9780');
  });

  it('남반구·서반구 좌표는 음수 그대로 보여 준다', () => {
    expect(formatCoordinate(-33.86882, -151.20929)).toBe('-33.8688, -151.2093');
  });

  it('반올림해 0 이 되는 음수에는 부호를 붙이지 않는다', () => {
    expect(formatCoordinate(-0.00001, -0.00004)).toBe('0.0000, 0.0000');
  });
});
