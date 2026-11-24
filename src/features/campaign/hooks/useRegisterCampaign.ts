import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { campaignKeys } from '../api/campaignKeys';
import type { CampaignRegistration } from '../api/campaignSchemas';
import { registerCampaign, type RegisterCampaignInput } from '../api/registerCampaign';

export function useRegisterCampaign(): UseMutationResult<
  CampaignRegistration,
  Error,
  RegisterCampaignInput
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerCampaign,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: campaignKeys.list() }),
  });
}
