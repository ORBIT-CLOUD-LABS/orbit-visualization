import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { campaignKeys } from '../api/campaignKeys';
import type { CampaignDetail } from '../api/campaignSchemas';
import { deactivateCampaign } from '../api/deactivateCampaign';

/** 성공하면 응답으로 상세 캐시를 바꾸고 목록은 다시 불러오게 한다 */
export function useDeactivateCampaign(): UseMutationResult<CampaignDetail, Error, number> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateCampaign,
    onSuccess: (campaign) => {
      queryClient.setQueryData(campaignKeys.detail(campaign.campaignId), campaign);
      return queryClient.invalidateQueries({ queryKey: campaignKeys.list() });
    },
  });
}
