import { describe, expect, it } from 'vitest';

import { resultRatios } from './resultRatios';

const stats = {
  campaignId: 7,
  targetVehicles: 100,
  succeeded: 80,
  failed: 5,
  failureReasons: {},
  inProgress: 15,
};

describe('resultRatios', () => {
  it('대상 차량 수 기준 백분율로 바꾼다', () => {
    expect(resultRatios(stats)).toEqual({ succeeded: 80, failed: 5, inProgress: 15 });
  });

  it('대상 차량이 없으면 모두 0 이다', () => {
    expect(
      resultRatios({ ...stats, targetVehicles: 0, succeeded: 0, failed: 0, inProgress: 0 }),
    ).toEqual({ succeeded: 0, failed: 0, inProgress: 0 });
  });
});
