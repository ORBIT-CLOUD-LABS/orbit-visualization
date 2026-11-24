import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { artifactKeys } from '../api/artifactKeys';
import type { Artifact } from '../api/artifactSchemas';
import { getArtifacts } from '../api/getArtifacts';

export function useArtifacts(): UseQueryResult<Artifact[]> {
  return useQuery({
    queryKey: artifactKeys.list(),
    queryFn: ({ signal }) => getArtifacts(signal),
  });
}
