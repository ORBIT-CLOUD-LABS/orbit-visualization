import type { CampaignStats } from '../api/campaignSchemas';

/** 실패 사유를 건수가 많은 순서로. 건수가 같으면 이름 순서 */
export function sortFailureReasons(
  failureReasons: CampaignStats['failureReasons'],
): [reason: string, count: number][] {
  return Object.entries(failureReasons).toSorted(
    ([reasonA, countA], [reasonB, countB]) => countB - countA || reasonA.localeCompare(reasonB),
  );
}
