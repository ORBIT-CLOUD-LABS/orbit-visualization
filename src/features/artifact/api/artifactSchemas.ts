import { z } from 'zod';

// 서버 ArtifactSummaryResponse·ArtifactDetailResponse. 목록 항목과 상세는 필드가 같다
export const artifactSchema = z.object({
  artifactId: z.number().int(),
  model: z.string(),
  version: z.string(),
  fileSize: z.number().int().nonnegative(),
  sha256: z.string(),
  path: z.string(),
  keyId: z.string(),
  createdAt: z.iso.datetime(),
});

export const artifactListSchema = z.object({
  artifacts: z.array(artifactSchema),
});

// 서버 ArtifactRegistrationResponse
export const artifactRegistrationSchema = z.object({
  artifactId: z.number().int(),
  fileSize: z.number().int().nonnegative(),
  sha256: z.string(),
  path: z.string(),
  keyId: z.string(),
});

export type Artifact = z.output<typeof artifactSchema>;
export type ArtifactRegistration = z.output<typeof artifactRegistrationSchema>;
