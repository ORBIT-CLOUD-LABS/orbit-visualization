import type { UpdateResult, VehicleStatus } from '../api/vehicleStatusSchema';

import { vehicleMarkerTone, type VehicleMarkerTone } from './vehicleMarkerTone';

/** [위도, 경도]. Leaflet 의 LatLngTuple 에 그대로 넘길 수 있다 */
export type LatLng = [latitude: number, longitude: number];

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

/** 위치를 보낸 차량만 지도 마커로 바꾼다. 순서는 받은 순서를 따른다 */
export function toVehicleMarkers(vehicles: readonly VehicleStatus[]): VehicleMarker[] {
  return vehicles.flatMap((vehicle) => {
    if (vehicle.location === null) {
      return [];
    }
    return [
      {
        vehicleId: vehicle.vehicleId,
        position: [vehicle.location.latitude, vehicle.location.longitude],
        result: vehicle.lastResult,
        tone: vehicleMarkerTone(vehicle.lastResult),
        locatedAt: vehicle.location.updatedAt,
        assignedEdgeId: vehicle.assignedEdgeId,
        downloadedEdgeId: vehicle.downloadedEdgeId,
      },
    ];
  });
}
