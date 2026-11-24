import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { vehicleUpdateHistorySchema, type VehicleUpdateEvent } from './vehicleSchemas';
import { vehiclePath } from './vehiclePath';

/** 차량 업데이트 이력 최근 50건. 완료 시각이 늦은 순이다 */
export async function getVehicleUpdateHistory(
  vehicleId: string,
  signal?: AbortSignal,
): Promise<VehicleUpdateEvent[]> {
  const response = await httpClient.get<unknown>(`${vehiclePath(vehicleId)}/events`, { signal });
  return parseApiResponse(response.data, vehicleUpdateHistorySchema).events;
}
