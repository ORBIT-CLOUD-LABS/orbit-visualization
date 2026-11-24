import { z } from 'zod';

/** 한 Edge 에서 파일을 받은 차량의 캠페인별 업데이트 성공·실패 수 (CdnEdgeDownloadResponse) */
const cdnEdgeDownloadSchema = z.object({
  campaignId: z.number(),
  succeeded: z.number(),
  failed: z.number(),
});

/** CDN Edge 하나의 대표 좌표·정상 여부·사용 현황 (CdnEdgeStatusResponse) */
const cdnEdgeStatusSchema = z.object({
  edgeId: z.string(),
  name: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  /** 요청을 받은 서버 Pod 의 헬스체크 결과라 Pod 마다 잠깐 다를 수 있다 */
  healthy: z.boolean(),
  /** 매니페스트가 이 Edge 를 마지막으로 배정한 차량 수 */
  assignedVehicles: z.number(),
  /** campaignId 오름차순. 기록이 없으면 빈 목록 */
  downloads: z.array(cdnEdgeDownloadSchema),
});

/** 대시보드 CDN Edge 상태 (CdnEdgesResponse). edges 는 서버 설정 순서 */
export const cdnEdgesSchema = z.object({
  edges: z.array(cdnEdgeStatusSchema),
});

export type CdnEdgeStatus = z.infer<typeof cdnEdgeStatusSchema>;
export type CdnEdges = z.infer<typeof cdnEdgesSchema>;
