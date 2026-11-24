import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { artifactOptionListSchema, type ArtifactOption } from './campaignSchemas';

/** 배포할 수 있는 업데이트 파일 전체. 최근 등록한 순서다 */
export async function getArtifactOptions(signal?: AbortSignal): Promise<ArtifactOption[]> {
  const response = await httpClient.get<unknown>('/admin/artifacts', { signal });
  return parseApiResponse(response.data, artifactOptionListSchema).artifacts;
}
