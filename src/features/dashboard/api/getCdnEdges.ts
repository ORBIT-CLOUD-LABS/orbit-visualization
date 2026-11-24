import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { cdnEdgesSchema, type CdnEdges } from './cdnEdgeSchema';

/** 서버 설정의 모든 CDN Edge 상태를 조회한다 */
export async function getCdnEdges(signal?: AbortSignal): Promise<CdnEdges> {
  const response = await httpClient.get<unknown>('/dashboard/cdn-edges', { signal });
  return parseApiResponse(response.data, cdnEdgesSchema);
}
