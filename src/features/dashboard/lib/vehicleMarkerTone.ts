import type { UpdateResult } from '@/shared/vehicle/updateResult';

/** 지도 차량 마커 색. 결과가 없으면 neutral */
export type VehicleMarkerTone = 'success' | 'danger' | 'neutral';

// UPDATE_RESULTS 의 값마다 색이 있어야 타입 검사를 통과한다
const RESULT_TONE: Record<UpdateResult, VehicleMarkerTone> = {
  SUCCEEDED: 'success',
  FAILED: 'danger',
};

export function vehicleMarkerTone(result: UpdateResult | null): VehicleMarkerTone {
  return result === null ? 'neutral' : RESULT_TONE[result];
}
