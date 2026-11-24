import { z } from 'zod';

/** 차량의 마지막 위치 (VehicleLocationResponse). 차량 상태와 차량 상세가 같은 형식을 쓴다 */
export const vehicleLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  updatedAt: z.iso.datetime(),
});

export type VehicleLocation = z.infer<typeof vehicleLocationSchema>;
