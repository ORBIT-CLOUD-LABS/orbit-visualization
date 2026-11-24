/** 대시보드 차량 API 경로. vehicleId 는 URL 에서 온 값이라 경로 조각으로 인코딩한다 */
export function vehiclePath(vehicleId: string): string {
  return `/dashboard/vehicles/${encodeURIComponent(vehicleId)}`;
}
