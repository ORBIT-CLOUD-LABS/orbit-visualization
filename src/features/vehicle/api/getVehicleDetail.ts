import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { vehicleDetailSchema, type VehicleDetail } from './vehicleSchemas';
import { vehiclePath } from './vehiclePath';

/** 차량 한 대 상세. 없는 차량이면 404 VEHICLE_NOT_FOUND */
export async function getVehicleDetail(
  vehicleId: string,
  signal?: AbortSignal,
): Promise<VehicleDetail> {
  const response = await httpClient.get<unknown>(vehiclePath(vehicleId), { signal });
  return parseApiResponse(response.data, vehicleDetailSchema);
}
