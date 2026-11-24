import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { artifactKeys } from '../api/artifactKeys';
import type { ArtifactRegistration } from '../api/artifactSchemas';
import { registerArtifact, type RegisterArtifactInput } from '../api/registerArtifact';

export function useRegisterArtifact(): UseMutationResult<
  ArtifactRegistration,
  Error,
  RegisterArtifactInput
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerArtifact,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: artifactKeys.list() }),
  });
}
