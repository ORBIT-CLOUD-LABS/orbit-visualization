import { z } from 'zod';

import type { RegisterArtifactInput } from '../api/registerArtifact';
import {
  artifactFormSchema,
  type ArtifactFormErrors,
  type ArtifactFormValues,
} from './artifactFormSchema';

export type ArtifactFormResult =
  { success: true; input: RegisterArtifactInput } | { success: false; errors: ArtifactFormErrors };

/** 입력값을 검증해 요청 값이나 칸마다 첫 오류 문구를 돌려준다 */
export function validateArtifactForm(values: ArtifactFormValues): ArtifactFormResult {
  const parsed = artifactFormSchema.safeParse(values);
  if (parsed.success) {
    return { success: true, input: parsed.data };
  }
  const { fieldErrors } = z.flattenError(parsed.error);
  return {
    success: false,
    errors: {
      file: fieldErrors.file?.[0],
      model: fieldErrors.model?.[0],
      version: fieldErrors.version?.[0],
      sha256: fieldErrors.sha256?.[0],
      signature: fieldErrors.signature?.[0],
      keyId: fieldErrors.keyId?.[0],
    },
  };
}
