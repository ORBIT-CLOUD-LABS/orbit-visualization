import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { QueryFallback } from '@/shared/ui/QueryFallback';

import type { CampaignStats } from '../api/campaignSchemas';
import { sortFailureReasons } from '../lib/sortFailureReasons';
import { TABLE_CELL as CELL, TABLE_HEAD_CELL as HEAD_CELL } from './tableClassNames';

type FailureReasonsCardProps = {
  /** 아직 받지 못했으면 undefined */
  stats: CampaignStats | undefined;
  isPending: boolean;
  onRetry: () => void;
};

export function FailureReasonsCard({ stats, isPending, onRetry }: FailureReasonsCardProps) {
  function renderContent() {
    if (stats === undefined) {
      return <QueryFallback isPending={isPending} onRetry={onRetry} />;
    }
    if (stats.failed === 0) {
      return <EmptyState title="실패한 차량이 없습니다" />;
    }
    return (
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse">
          <thead className="bg-subtle">
            <tr>
              <th scope="col" className={HEAD_CELL}>
                실패 사유
              </th>
              <th scope="col" className={HEAD_CELL}>
                건수
              </th>
            </tr>
          </thead>
          <tbody>
            {sortFailureReasons(stats.failureReasons).map(([reason, count]) => (
              <tr key={reason} className="border-t border-line bg-surface">
                <td className={CELL}>{reason}</td>
                <td className={CELL}>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <Card title="실패 사유별 건수" className="xl:w-100 xl:shrink-0">
      {renderContent()}
    </Card>
  );
}
