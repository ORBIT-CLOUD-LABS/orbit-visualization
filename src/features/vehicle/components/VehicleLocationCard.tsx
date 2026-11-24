import type { VehicleLocation } from '@/shared/vehicle/vehicleLocationSchema';

import { formatTimestamp } from '../lib/formatTimestamp';

import { Card } from './Card';
import { KeyValue } from './KeyValue';

const EMPTY_VALUE = '—';
const COORDINATE_DIGITS = 4;

type VehicleLocationCardProps = {
  /** 위치를 받은 적 없으면 null */
  location: VehicleLocation | null;
  assignedEdgeId: string | null;
  className?: string;
};

/** 마지막 위치와 배정 Edge. 지도는 아직 그리지 않고 좌표만 보여 준다 */
export function VehicleLocationCard({
  location,
  assignedEdgeId,
  className,
}: VehicleLocationCardProps) {
  return (
    <Card title="위치 · 배정 Edge" className={className}>
      {location === null && <p className="text-xs text-fg-muted">아직 위치를 받지 않았습니다</p>}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
        <KeyValue label="위도">
          {location?.latitude.toFixed(COORDINATE_DIGITS) ?? EMPTY_VALUE}
        </KeyValue>
        <KeyValue label="경도">
          {location?.longitude.toFixed(COORDINATE_DIGITS) ?? EMPTY_VALUE}
        </KeyValue>
        <KeyValue label="위치 수신">
          {location === null ? EMPTY_VALUE : formatTimestamp(location.updatedAt)}
        </KeyValue>
        <KeyValue label="배정 Edge">{assignedEdgeId ?? EMPTY_VALUE}</KeyValue>
      </dl>
    </Card>
  );
}
