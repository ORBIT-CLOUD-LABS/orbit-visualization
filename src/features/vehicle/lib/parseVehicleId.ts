/** URL 의 vehicleId 를 읽는다. 비었거나 공백뿐이면 null (없는 차량으로 본다) */
export function parseVehicleId(value: string | undefined): string | null {
  if (value === undefined || value.trim() === '') {
    return null;
  }
  return value;
}
