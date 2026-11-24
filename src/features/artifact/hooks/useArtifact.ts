import { skipToken, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { artifactKeys } from '../api/artifactKeys';
import type { Artifact } from '../api/artifactSchemas';
import { getArtifact } from '../api/getArtifact';

/** artifactId 가 null 이면 요청하지 않는다 */
export function useArtifact(artifactId: number | null): UseQueryResult<Artifact> {
  return useQuery({
    queryKey: artifactKeys.detail(artifactId ?? 0),
    queryFn: artifactId === null ? skipToken : ({ signal }) => getArtifact(artifactId, signal),
  });
}
