import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { artifactSchema, type Artifact } from './artifactSchemas';

/** @throws 없는 파일이면 ApiError(404, ARTIFACT_NOT_FOUND) */
export async function getArtifact(artifactId: number, signal?: AbortSignal): Promise<Artifact> {
  const response = await httpClient.get<unknown>(`/admin/artifacts/${artifactId}`, { signal });
  return parseApiResponse(response.data, artifactSchema);
}
