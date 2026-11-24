import { skipToken, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import { artifactKeys } from '../api/artifactKeys';
import type { Artifact } from '../api/artifactSchemas';
import { getArtifact } from '../api/getArtifact';

/**
 * artifactId 가 null 이면 요청하지 않는다.
 * 목록에서 들어오면 목록 캐시의 같은 항목을 먼저 보여 주고 상세 응답으로 바꾼다.
 */
export function useArtifact(artifactId: number | null): UseQueryResult<Artifact> {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: artifactKeys.detail(artifactId ?? 0),
    queryFn: artifactId === null ? skipToken : ({ signal }) => getArtifact(artifactId, signal),
    placeholderData: () =>
      queryClient
        .getQueryData<Artifact[]>(artifactKeys.list())
        ?.find((artifact) => artifact.artifactId === artifactId),
  });
}
