import { VehicleResultBadge } from '@/shared/vehicle/VehicleResultBadge';

import type { VehicleUpdateEvent } from '../api/vehicleSchemas';
import { formatTimestamp } from '../lib/formatTimestamp';

const EMPTY_VALUE = '—';
const COLUMNS = ['완료 시각', '캠페인', '버전', '결과', '실패 사유', '다운로드 Edge'] as const;

type UpdateHistoryTableProps = {
  events: readonly VehicleUpdateEvent[];
};

// 서버가 id 를 주지 않으므로 한 시도를 가리키는 값을 묶어 key 로 쓴다
function eventKey(event: VehicleUpdateEvent): string {
  return `${event.finishedAt}-${event.campaignId}-${event.version}-${event.result}`;
}

export function UpdateHistoryTable({ events }: UpdateHistoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table aria-label="업데이트 이력" className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-subtle text-xs text-fg-muted">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-surface font-mono text-fg">
          {events.map((event) => (
            <tr key={eventKey(event)}>
              <td className="px-4 py-3">{formatTimestamp(event.finishedAt)}</td>
              <td className="px-4 py-3">{event.campaignId}</td>
              <td className="px-4 py-3">{event.version}</td>
              <td className="px-4 py-3 font-sans">
                <VehicleResultBadge result={event.result} />
              </td>
              <td className="px-4 py-3">{event.failureReason ?? EMPTY_VALUE}</td>
              <td className="px-4 py-3">{event.edgeId ?? EMPTY_VALUE}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
