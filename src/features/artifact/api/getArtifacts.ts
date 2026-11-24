import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { artifactListSchema, type Artifact } from './artifactSchemas';

/** 등록한 업데이트 파일 전체. 최근 등록한 순서다 */
export async function getArtifacts(signal?: AbortSignal): Promise<Artifact[]> {
  const response = await httpClient.get<unknown>('/admin/artifacts', { signal });
  return parseApiResponse(response.data, artifactListSchema).artifacts;
}
