import { Link } from 'react-router';

import { routePaths } from '@/shared/config/routes';
import { formatClockTime } from '@/shared/lib/formatClockTime';
import { VehicleResultBadge } from '@/shared/vehicle/VehicleResultBadge';

import type { VehicleMarker } from '../lib/toVehicleMarkers';

type VehicleMarkerPopupProps = {
  marker: VehicleMarker;
};

/** 차량 마커를 누르면 보이는 내용. 차량 상세로 가는 링크를 둔다 */
export function VehicleMarkerPopup({ marker }: VehicleMarkerPopupProps) {
  return (
    <div className="flex flex-col gap-2 font-sans text-xs text-fg">
      <Link
        to={routePaths.vehicleDetail(marker.vehicleId)}
        // leaflet.css 의 `.leaflet-container a` 색이 유틸리티보다 우선해 ! 로 덮는다
        className="font-mono text-sm text-primary! hover:underline"
      >
        {marker.vehicleId}
      </Link>
      <dl className="grid grid-cols-2 items-center gap-x-3 gap-y-1">
        <dt className="text-fg-muted">최근 결과</dt>
        <dd>
          <VehicleResultBadge result={marker.result} />
        </dd>
        <dt className="text-fg-muted">마지막 위치</dt>
        <dd className="font-mono">{formatClockTime(marker.locatedAt) ?? '—'}</dd>
      </dl>
    </div>
  );
}
