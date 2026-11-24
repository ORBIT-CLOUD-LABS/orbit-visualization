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

  it('따로 반올림해도 합이 100 이 되도록 남은 몫을 나눈다', () => {
    expect(
      resultRatios({ ...stats, targetVehicles: 3, succeeded: 1, failed: 1, inProgress: 1 }),
    ).toEqual({ succeeded: 34, failed: 33, inProgress: 33 });
    expect(
      resultRatios({ ...stats, targetVehicles: 11, succeeded: 5, failed: 5, inProgress: 1 }),
    ).toEqual({ succeeded: 46, failed: 45, inProgress: 9 });
  });

  it('대상 차량이 없으면 모두 0 이다', () => {
    expect(
      resultRatios({ ...stats, targetVehicles: 0, succeeded: 0, failed: 0, inProgress: 0 }),
    ).toEqual({ succeeded: 0, failed: 0, inProgress: 0 });
  });
});
