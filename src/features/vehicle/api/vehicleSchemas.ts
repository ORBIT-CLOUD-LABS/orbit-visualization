import { z } from 'zod';

import { UPDATE_RESULTS } from '@/shared/vehicle/updateResult';
import { vehicleLocationSchema } from '@/shared/vehicle/vehicleLocationSchema';

const instantSchema = z.iso.datetime();

/** 차량 상세의 최근 업데이트 결과 (VehicleLastUpdateResponse) */
export const vehicleLastUpdateSchema = z.object({
  campaignId: z.number(),
  result: z.enum(UPDATE_RESULTS),
  /** 실패가 아니면 null */
  failureReason: z.string().nullable(),
  /** 차량이 보낸 실패 상세. 보내지 않았으면 null */
  failureDetail: z.string().nullable(),
  /** 차량이 실제로 파일을 받은 Edge. 다운로드 전에 실패했으면 null */
  edgeId: z.string().nullable(),
  finishedAt: instantSchema,
});

/** 차량 한 대 상세 (VehicleDetailResponse) */
export const vehicleDetailSchema = z.object({
  vehicleId: z.string(),
  model: z.string(),
  hwVersion: z.string(),
  region: z.string(),
  currentVersion: z.string(),
  /** 체크인한 적 없으면 null */
  lastSeenAt: instantSchema.nullable(),
  updatedAt: instantSchema,
  location: vehicleLocationSchema.nullable(),
  assignedEdgeId: z.string().nullable(),
  /** 결과가 없으면 null */
  lastUpdate: vehicleLastUpdateSchema.nullable(),
});

/** 업데이트 시도 한 번 (VehicleUpdateEventResponse) */
export const vehicleUpdateEventSchema = z.object({
  campaignId: z.number(),
  version: z.string(),
  result: z.enum(UPDATE_RESULTS),
  failureReason: z.string().nullable(),
  failureDetail: z.string().nullable(),
  edgeId: z.string().nullable(),
  finishedAt: instantSchema,
});

/** 업데이트 이력 (VehicleUpdateHistoryResponse). 최근 50건, 완료 시각이 늦은 순 */
export const vehicleUpdateHistorySchema = z.object({
  events: z.array(vehicleUpdateEventSchema),
});

export type VehicleLastUpdate = z.infer<typeof vehicleLastUpdateSchema>;
export type VehicleDetail = z.infer<typeof vehicleDetailSchema>;
export type VehicleUpdateEvent = z.infer<typeof vehicleUpdateEventSchema>;
export type VehicleUpdateHistory = z.infer<typeof vehicleUpdateHistorySchema>;
