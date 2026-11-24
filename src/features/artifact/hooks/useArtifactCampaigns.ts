import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { artifactKeys } from '../api/artifactKeys';
import { getModelCampaigns, type ArtifactCampaign } from '../api/getModelCampaigns';

/**
 * 이 파일과 같은 차종·버전을 목표로 하는 캠페인.
 * 서버는 차종으로만 거를 수 있어 버전은 브라우저에서 거른다. 캠페인 목표 버전은 파일 버전 표기 그대로다.
 */
export function useArtifactCampaigns(
  model: string,
  version: string,
): UseQueryResult<ArtifactCampaign[]> {
  return useQuery({
    queryKey: artifactKeys.campaigns(model),
    queryFn: ({ signal }) => getModelCampaigns(model, signal),
    select: (campaigns) => campaigns.filter((campaign) => campaign.targetVersion === version),
  });
}
