import type { CampaignStats } from '../api/campaignSchemas';

export type ResultRatios = {
  /** 대상 차량 수 대비 백분율(0~100 정수). 대상이 없으면 모두 0, 있으면 합이 100 */
  succeeded: number;
  failed: number;
  inProgress: number;
};

type ResultKey = keyof ResultRatios;

const KEYS: readonly ResultKey[] = ['succeeded', 'failed', 'inProgress'];

/**
 * 결과별 차량 수를 대상 차량 수 기준 비율로 바꾼다.
 * 따로 반올림하면 합이 99·101 이 되어 막대가 비거나 넘치므로, 내림한 뒤 남은 몫을 소수점이 큰 순서로 1씩 나눈다.
 */
export function resultRatios(stats: CampaignStats): ResultRatios {
  const ratios: ResultRatios = { succeeded: 0, failed: 0, inProgress: 0 };
  const total = stats.targetVehicles;
  if (total === 0) {
    return ratios;
  }
  const exact = KEYS.map((key) => ({ key, value: (stats[key] * 100) / total }));
  exact.forEach(({ key, value }) => {
    ratios[key] = Math.floor(value);
  });
  const remainder = 100 - KEYS.reduce((sum, key) => sum + ratios[key], 0);
  exact
    .toSorted((a, b) => (b.value % 1) - (a.value % 1))
    .slice(0, remainder)
    .forEach(({ key }) => {
      ratios[key] += 1;
    });
  return ratios;
}
