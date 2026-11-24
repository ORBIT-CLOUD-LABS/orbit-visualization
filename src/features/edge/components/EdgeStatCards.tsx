import { StatCard } from '@/shared/ui/StatCard';

import type { EdgeSummary } from '../lib/summarizeEdges';

type EdgeStatCardsProps = {
  /** 아직 Edge 상태를 받지 못했으면 null. 값 자리에 — 를 보여 준다 */
  summary: EdgeSummary | null;
};

const PLACEHOLDER = '—';

export function EdgeStatCards({ summary }: EdgeStatCardsProps) {
  return (
    <section aria-label="Edge 통계" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard label="Edge 수" value={summary?.total ?? PLACEHOLDER} />
      <StatCard label="정상 Edge" value={summary?.healthy ?? PLACEHOLDER} />
      <StatCard label="장애 Edge" value={summary?.unhealthy ?? PLACEHOLDER} />
      <StatCard label="배정 차량 합계" value={summary?.assignedVehicles ?? PLACEHOLDER} />
    </section>
  );
}
