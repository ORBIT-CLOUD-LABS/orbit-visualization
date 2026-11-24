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
    // 요청 값에 최대 1GB 파일이 있어 화면을 떠나면 바로 캐시에서 놓는다
    gcTime: 0,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: artifactKeys.list() }),
  });
}
