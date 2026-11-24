import { Link } from 'react-router';

import { routePaths } from '@/shared/config/routes';

import type { VehicleStatus } from '../api/vehicleStatusSchema';
import { formatClockTime } from '../lib/formatClockTime';

import { VehicleResultBadge } from './VehicleResultBadge';

const EMPTY_VALUE = '—';

const COLUMNS = [
  'vehicleId',
  '차종',
  '현재 버전',
  '캠페인',
  '최근 결과',
  '실패 사유',
  '배정 Edge',
  '다운로드 Edge',
  '마지막 체크인',
] as const;

type VehicleTableProps = {
  vehicles: readonly VehicleStatus[];
  /** 표 이름을 주는 제목 요소의 id */
  labelledBy: string;
};

function orEmpty(value: string | number | null): string | number {
  return value ?? EMPTY_VALUE;
}

export function VehicleTable({ vehicles, labelledBy }: VehicleTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table aria-labelledby={labelledBy} className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-subtle text-xs text-fg-muted">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-surface text-fg">
          {vehicles.map((vehicle) => (
            <tr key={vehicle.vehicleId}>
              <th scope="row" className="px-4 py-3 font-mono font-normal">
                <Link
                  to={routePaths.vehicleDetail(vehicle.vehicleId)}
                  className="rounded-xs text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {vehicle.vehicleId}
                </Link>
              </th>
              <td className="px-4 py-3">{vehicle.model}</td>
              <td className="px-4 py-3 font-mono">{vehicle.currentVersion}</td>
              <td className="px-4 py-3 font-mono">{orEmpty(vehicle.campaignId)}</td>
              <td className="px-4 py-3">
                <VehicleResultBadge result={vehicle.lastResult} />
              </td>
              <td className="px-4 py-3 font-mono">{orEmpty(vehicle.failureReason)}</td>
              <td className="px-4 py-3 font-mono">{orEmpty(vehicle.assignedEdgeId)}</td>
              <td className="px-4 py-3 font-mono">{orEmpty(vehicle.downloadedEdgeId)}</td>
              <td className="px-4 py-3 font-mono">
                {vehicle.lastSeenAt === null
                  ? EMPTY_VALUE
                  : orEmpty(formatClockTime(vehicle.lastSeenAt))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
