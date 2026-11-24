import type { LatLng } from '@/shared/map/latLng';
import { vehicleMarkerTone, type VehicleMarkerTone } from '@/shared/map/vehicleMarkerTone';
import type { UpdateResult } from '@/shared/vehicle/updateResult';

import type { VehicleStatus } from '../api/vehicleStatusSchema';

export type VehicleMarker = {
  vehicleId: string;
  position: LatLng;
  result: UpdateResult | null;
  tone: VehicleMarkerTone;
  /** 위치를 보낸 시각 */
  locatedAt: string;
  assignedEdgeId: string | null;
  downloadedEdgeId: string | null;
};

/** 차량 상태 객체별로 만든 마커. 위치가 없으면 null 이다 */
export type VehicleMarkerCache = WeakMap<VehicleStatus, VehicleMarker | null>;

function toVehicleMarker(vehicle: VehicleStatus): VehicleMarker | null {
  if (vehicle.location === null) {
    return null;
  }
  return {
    vehicleId: vehicle.vehicleId,
    position: [vehicle.location.latitude, vehicle.location.longitude],
    result: vehicle.lastResult,
    tone: vehicleMarkerTone(vehicle.lastResult),
    locatedAt: vehicle.location.updatedAt,
    assignedEdgeId: vehicle.assignedEdgeId,
    downloadedEdgeId: vehicle.downloadedEdgeId,
  };
}

/**
 * 위치를 보낸 차량만 지도 마커로 바꾼다. 순서는 받은 순서를 따른다.
 * SSE 변경분을 합쳐도 바뀌지 않은 차량은 같은 객체로 남으므로, cache 를 넘기면 그 차량의 마커를 그대로 재사용한다
 * (Leaflet 은 좌표 배열이 바뀌어야 마커를 다시 그린다).
 */
export function toVehicleMarkers(
  vehicles: readonly VehicleStatus[],
  cache: VehicleMarkerCache = new WeakMap(),
): VehicleMarker[] {
  return vehicles.flatMap((vehicle) => {
    let marker = cache.get(vehicle);
    if (marker === undefined) {
      marker = toVehicleMarker(vehicle);
      cache.set(vehicle, marker);
    }
    return marker === null ? [] : [marker];
  });
}
