import { z } from 'zod';

/** 차량의 마지막 위치 (VehicleLocationResponse). 차량 상태와 차량 상세가 같은 형식을 쓴다 */
export const vehicleLocationSchema = z.object({
  // 서버가 체크인 때 범위를 검증하지만, 지도와 거리 계산이 그대로 쓰므로 받는 곳에서도 막는다
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  updatedAt: z.iso.datetime(),
});

export type VehicleLocation = z.infer<typeof vehicleLocationSchema>;
