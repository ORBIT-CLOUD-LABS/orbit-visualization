import { skipToken, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getVehicleDetail } from '../api/getVehicleDetail';
import { vehicleKeys } from '../api/vehicleKeys';
import type { VehicleDetail } from '../api/vehicleSchemas';

/** vehicleId 가 null 이면 요청하지 않는다 */
export function useVehicleDetail(vehicleId: string | null): UseQueryResult<VehicleDetail> {
  return useQuery({
    queryKey: vehicleKeys.detail(vehicleId ?? ''),
    queryFn: vehicleId === null ? skipToken : ({ signal }) => getVehicleDetail(vehicleId, signal),
  });
}
