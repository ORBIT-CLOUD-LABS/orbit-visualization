// 서버의 SSE 경로(/dashboard/vehicles/stream)와 겹쳐 상세로 조회할 수 없는 값
const RESERVED_ID = 'stream';

/** URL 의 vehicleId 를 읽는다. 비었거나 공백뿐이거나 조회할 수 없는 값이면 null (없는 차량으로 본다) */
export function parseVehicleId(value: string | undefined): string | null {
  if (value === undefined || value.trim() === '' || value === RESERVED_ID) {
    return null;
  }
  return value;
}
