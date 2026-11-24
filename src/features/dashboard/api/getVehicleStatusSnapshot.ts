import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { vehicleStatusSnapshotSchema, type VehicleStatusSnapshot } from './vehicleStatusSchema';

/** 전체 차량 상태 스냅샷을 조회한다. SSE 를 먼저 연결한 뒤 부른다 */
export async function getVehicleStatusSnapshot(
  signal?: AbortSignal,
): Promise<VehicleStatusSnapshot> {
  const response = await httpClient.get<unknown>('/dashboard/vehicles', { signal });
  return parseApiResponse(response.data, vehicleStatusSnapshotSchema);
}
