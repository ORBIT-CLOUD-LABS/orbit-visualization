import { skipToken, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getVehicleUpdateHistory } from '../api/getVehicleUpdateHistory';
import { vehicleKeys } from '../api/vehicleKeys';
import type { VehicleUpdateEvent } from '../api/vehicleSchemas';

/** vehicleId 가 null 이면 요청하지 않는다 */
export function useVehicleUpdateHistory(
  vehicleId: string | null,
): UseQueryResult<VehicleUpdateEvent[]> {
  return useQuery({
    queryKey: vehicleKeys.history(vehicleId ?? ''),
    queryFn:
      vehicleId === null ? skipToken : ({ signal }) => getVehicleUpdateHistory(vehicleId, signal),
  });
}
