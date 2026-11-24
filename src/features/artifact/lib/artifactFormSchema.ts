import { z } from 'zod';

/** 서버 multipart max-file-size(1GB) */
export const MAX_FILE_BYTES = 1024 ** 3;

const MAX_TEXT_LENGTH = 50;
// 서버 DottedVersion 형식. 한 자리는 9자까지
const VERSION_PATTERN = /^\d{1,9}(\.\d{1,9})*$/;
const SHA256_PATTERN = /^[0-9a-fA-F]{64}$/;

/**
 * 파일 등록 입력 검증. 서버 RegisterArtifactRequest·ArtifactRelease 규칙과 맞춘다.
 * 글자 앞뒤 공백은 복사·붙여넣기 실수로 보고 지운 값을 보낸다.
 */
export const artifactFormSchema = z.object({
  file: z
    .custom<File>((value) => value instanceof File, '업데이트 파일을 선택하세요')
    .refine((file) => file.size <= MAX_FILE_BYTES, '1GB 이하 파일만 등록할 수 있습니다'),
  model: z
    .string()
    .trim()
    .min(1, '차종을 입력하세요')
    .max(MAX_TEXT_LENGTH, `${MAX_TEXT_LENGTH}자 이하로 입력하세요`)
    .refine((model) => !model.includes('/'), '`/` 는 사용할 수 없습니다'),
  version: z
    .string()
    .trim()
    .min(1, '버전을 입력하세요')
    .max(MAX_TEXT_LENGTH, `${MAX_TEXT_LENGTH}자 이하로 입력하세요`)
    .regex(VERSION_PATTERN, '숫자와 점으로 입력하세요 (예: 1.0.1)'),
  sha256: z
    .string()
    .trim()
    .refine((sha256) => sha256 === '' || SHA256_PATTERN.test(sha256), 'hex 64자로 입력하세요')
    .transform((sha256) => (sha256 === '' ? undefined : sha256)),
  signature: z
    .string()
    .trim()
    .min(1, '서명을 입력하세요')
    // Vault 출력을 통째로 붙이면 서버는 이유를 알려 주지 않고 거절하므로 미리 막는다
    .refine(
      (signature) => !signature.startsWith('vault:'),
      '`vault:v1:` 를 빼고 서명값만 입력하세요',
    ),
  keyId: z.string().trim().min(1, '키 버전을 입력하세요'),
});

/** 화면 입력 상태. 파일을 고르기 전에는 null */
export type ArtifactFormValues = Omit<z.input<typeof artifactFormSchema>, 'file'> & {
  file: File | null;
};
export type ArtifactFormField = keyof ArtifactFormValues;
export type ArtifactFormErrors = Partial<Record<ArtifactFormField, string>>;
