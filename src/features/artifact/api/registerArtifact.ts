import { httpClient } from '@/shared/api/httpClient';
import { parseApiResponse } from '@/shared/api/parseApiResponse';

import { artifactRegistrationSchema, type ArtifactRegistration } from './artifactSchemas';

export type RegisterArtifactInput = {
  file: File;
  model: string;
  version: string;
  /** 비워 두면 보내지 않는다 */
  sha256?: string;
  signature: string;
  keyId: string;
};

/**
 * 업데이트 파일을 multipart 로 올린다.
 * 최대 1GB 를 올리므로 공통 timeout(10초)을 쓰지 않는다.
 */
export async function registerArtifact(
  input: RegisterArtifactInput,
): Promise<ArtifactRegistration> {
  const form = new FormData();
  form.append('file', input.file);
  form.append('model', input.model);
  form.append('version', input.version);
  if (input.sha256 !== undefined) {
    form.append('sha256', input.sha256);
  }
  form.append('signature', input.signature);
  form.append('keyId', input.keyId);

  const response = await httpClient.post<unknown>('/admin/artifacts', form, { timeout: 0 });
  return parseApiResponse(response.data, artifactRegistrationSchema);
}
