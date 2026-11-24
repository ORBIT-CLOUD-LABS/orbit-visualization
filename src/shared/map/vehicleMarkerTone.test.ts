import { describe, expect, it } from 'vitest';

import { vehicleMarkerTone } from './vehicleMarkerTone';

describe('vehicleMarkerTone', () => {
  it.each([
    ['SUCCEEDED', 'success'],
    ['FAILED', 'danger'],
    [null, 'neutral'],
  ] as const)('%s 결과는 %s 색이다', (result, tone) => {
    expect(vehicleMarkerTone(result)).toBe(tone);
  });
});
