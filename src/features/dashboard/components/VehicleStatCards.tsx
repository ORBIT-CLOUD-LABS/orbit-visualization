import { StatCard } from '@/shared/ui/StatCard';

import type { VehicleResultCounts } from '../lib/countVehicleResults';

type VehicleStatCardsProps = {
  /** 아직 스냅샷을 받지 못했으면 null. 값 자리에 — 를 보여 준다 */
  counts: VehicleResultCounts | null;
};

const PLACEHOLDER = '—';

export function VehicleStatCards({ counts }: VehicleStatCardsProps) {
  return (
    <section aria-label="차량 통계" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard label="전체 차량" value={counts?.total ?? PLACEHOLDER} />
      <StatCard label="최근 결과 SUCCEEDED" value={counts?.succeeded ?? PLACEHOLDER} />
      <StatCard label="최근 결과 FAILED" value={counts?.failed ?? PLACEHOLDER} />
      <StatCard label="결과 없음" value={counts?.noResult ?? PLACEHOLDER} />
    </section>
  );
}
