import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { campaignKeys } from '../api/campaignKeys';
import type { ArtifactOption } from '../api/campaignSchemas';
import { getArtifactOptions } from '../api/getArtifactOptions';

export function useArtifactOptions(): UseQueryResult<ArtifactOption[]> {
  return useQuery({
    queryKey: campaignKeys.artifactOptions(),
    queryFn: ({ signal }) => getArtifactOptions(signal),
  });
}
