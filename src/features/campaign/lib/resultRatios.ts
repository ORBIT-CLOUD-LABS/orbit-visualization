import type { CampaignStats } from '../api/campaignSchemas';

export type ResultRatios = {
  /** 대상 차량 수 대비 백분율(0~100). 대상이 없으면 모두 0 */
  succeeded: number;
  failed: number;
  inProgress: number;
};

function percent(count: number, total: number): number {
  return total === 0 ? 0 : Math.round((count / total) * 100);
}

/** 결과별 차량 수를 대상 차량 수 기준 비율로 바꾼다 */
export function resultRatios({
  targetVehicles,
  succeeded,
  failed,
  inProgress,
}: CampaignStats): ResultRatios {
  return {
    succeeded: percent(succeeded, targetVehicles),
    failed: percent(failed, targetVehicles),
    inProgress: percent(inProgress, targetVehicles),
  };
}
