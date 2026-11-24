import { z } from 'zod';

/** 차량별 최근 업데이트 결과. 결과가 없으면 null 이다 */
export const UPDATE_RESULTS = ['SUCCEEDED', 'FAILED'] as const;
export type UpdateResult = (typeof UPDATE_RESULTS)[number];

const instantSchema = z.iso.datetime();

/** 차량의 마지막 위치 (VehicleLocationResponse) */
export const vehicleLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  updatedAt: instantSchema,
});

/** 차량 한 대 상태 (VehicleStatusResponse). 스냅샷과 SSE `vehicles` 이벤트가 같은 형식을 쓴다 */
export const vehicleStatusSchema = z.object({
  vehicleId: z.string(),
  model: z.string(),
  currentVersion: z.string(),
  /** 체크인한 적 없으면 null */
  lastSeenAt: instantSchema.nullable(),
  /** 상태가 마지막으로 바뀐 시각. 같은 차량이 두 번 오면 이 값이 늦은 쪽을 쓴다 */
  updatedAt: instantSchema,
  campaignId: z.number().nullable(),
  lastResult: z.enum(UPDATE_RESULTS).nullable(),
  failureReason: z.string().nullable(),
  location: vehicleLocationSchema.nullable(),
  assignedEdgeId: z.string().nullable(),
  downloadedEdgeId: z.string().nullable(),
});

/** SSE `vehicles` 이벤트의 data. 상태가 바뀐 차량 목록이다 */
export const vehicleStatusChangesSchema = z.array(vehicleStatusSchema);

/** 전체 차량 상태 스냅샷 (VehicleStatusSnapshotResponse). vehicles 는 vehicleId 오름차순 */
export const vehicleStatusSnapshotSchema = z.object({
  asOf: instantSchema,
  vehicles: z.array(vehicleStatusSchema),
});

export type VehicleLocation = z.infer<typeof vehicleLocationSchema>;
export type VehicleStatus = z.infer<typeof vehicleStatusSchema>;
export type VehicleStatusSnapshot = z.infer<typeof vehicleStatusSnapshotSchema>;
