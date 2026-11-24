import { Link } from 'react-router';

import { routePaths } from '@/shared/config/routes';
import { Button } from '@/shared/ui/Button';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import { Card } from '@/shared/ui/Card';
import { VehicleResultBadge } from '@/shared/vehicle/VehicleResultBadge';

import type { VehicleDetail } from '../api/vehicleSchemas';
import { formatTimestamp } from '../lib/formatTimestamp';

import { KeyValue } from './KeyValue';

type VehicleSummaryCardProps = {
  vehicle: VehicleDetail;
  isRefreshing: boolean;
  onRefresh: () => void;
};

/** 차량 기본 정보. 제목은 vehicleId, 옆에 최근 결과 배지 */
export function VehicleSummaryCard({ vehicle, isRefreshing, onRefresh }: VehicleSummaryCardProps) {
  const { lastUpdate } = vehicle;

  return (
    <Card
      className="p-6"
      title={<span className="font-mono text-2xl font-medium">{vehicle.vehicleId}</span>}
      badge={
        <span className="flex items-center gap-1.5 text-xs text-fg-muted">
          최근 결과
          <VehicleResultBadge result={lastUpdate?.result ?? null} />
        </span>
      }
      action={
        <>
          {lastUpdate !== null && (
            <Link
              to={routePaths.campaignDetail(lastUpdate.campaignId)}
              className={buttonClassName({ variant: 'secondary' })}
            >
              캠페인 #{lastUpdate.campaignId} 보기
            </Link>
          )}
          <Button variant="secondary" disabled={isRefreshing} onClick={onRefresh}>
            새로고침
          </Button>
        </>
      }
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
        <KeyValue label="차종">{vehicle.model}</KeyValue>
        <KeyValue label="HW 버전">{vehicle.hwVersion}</KeyValue>
        <KeyValue label="지역">{vehicle.region}</KeyValue>
        <KeyValue label="현재 버전">{vehicle.currentVersion}</KeyValue>
        <KeyValue label="마지막 체크인">
          {vehicle.lastSeenAt === null ? null : formatTimestamp(vehicle.lastSeenAt)}
        </KeyValue>
        <KeyValue label="상태 갱신">{formatTimestamp(vehicle.updatedAt)}</KeyValue>
        <KeyValue label="배정 Edge">{vehicle.assignedEdgeId}</KeyValue>
        <KeyValue label="다운로드 Edge">{lastUpdate?.edgeId}</KeyValue>
      </dl>
    </Card>
  );
}
