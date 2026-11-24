import type { VehicleStatus } from '../api/vehicleStatusSchema';

function compareVehicleId(a: VehicleStatus, b: VehicleStatus): number {
  if (a.vehicleId === b.vehicleId) {
    return 0;
  }
  return a.vehicleId < b.vehicleId ? -1 : 1;
}

/**
 * 차량 목록에 변경분을 합친다. 같은 vehicleId 는 updatedAt 이 늦은 쪽을 쓴다.
 * 스냅샷과 SSE 에 같은 변경이 겹쳐 와도, 순서가 뒤바뀌어 와도 최신 상태만 남는다.
 * 처음 보는 차량이 있으면 vehicleId 순으로 다시 정렬한다.
 */
export function mergeVehicleStatuses(
  current: readonly VehicleStatus[],
  changes: readonly VehicleStatus[],
): VehicleStatus[] {
  const byId = new Map(current.map((vehicle) => [vehicle.vehicleId, vehicle]));
  let hasNewVehicle = false;

  changes.forEach((change) => {
    const existing = byId.get(change.vehicleId);
    if (existing === undefined) {
      hasNewVehicle = true;
      byId.set(change.vehicleId, change);
      return;
    }
    if (Date.parse(change.updatedAt) >= Date.parse(existing.updatedAt)) {
      byId.set(change.vehicleId, change);
    }
  });

  const merged = [...byId.values()];
  return hasNewVehicle ? merged.sort(compareVehicleId) : merged;
}
