import type { UpdateResult } from '../api/vehicleStatusSchema';

/** 지도 차량 마커 색. 결과가 없으면 neutral */
export type VehicleMarkerTone = 'success' | 'danger' | 'neutral';

const RESULT_TONE: Record<UpdateResult, VehicleMarkerTone> = {
  SUCCEEDED: 'success',
  FAILED: 'danger',
};

export function vehicleMarkerTone(result: UpdateResult | null): VehicleMarkerTone {
  return result === null ? 'neutral' : RESULT_TONE[result];
}
