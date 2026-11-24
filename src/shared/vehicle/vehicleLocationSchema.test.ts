import { describe, expect, it } from 'vitest';

import { vehicleLocationSchema } from './vehicleLocationSchema';

const updatedAt = '2026-11-24T01:02:03Z';

describe('vehicleLocationSchema', () => {
  it('범위 안의 좌표를 받는다', () => {
    expect(
      vehicleLocationSchema.safeParse({ latitude: -90, longitude: 180, updatedAt }).success,
    ).toBe(true);
  });

  it.each([
    { latitude: 90.1, longitude: 0 },
    { latitude: -90.1, longitude: 0 },
    { latitude: 0, longitude: 180.1 },
    { latitude: 0, longitude: -180.1 },
  ])('범위를 벗어난 좌표 %o 는 거절한다', (coordinates) => {
    expect(vehicleLocationSchema.safeParse({ ...coordinates, updatedAt }).success).toBe(false);
  });
});
