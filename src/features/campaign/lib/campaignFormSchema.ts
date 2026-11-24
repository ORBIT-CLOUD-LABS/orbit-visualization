import { z } from 'zod';

import type { ArtifactOption } from '../api/campaignSchemas';

const MAX_NAME_LENGTH = 100;
const MAX_TEXT_LENGTH = 50;
// 서버 DottedVersion 형식. 한 자리는 9자까지
const VERSION_PATTERN = /^\d{1,9}(\.\d{1,9})*$/;
// <input type="datetime-local"> 값. 초는 받지 않는다
const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/** datetime-local 값을 UTC 시각으로 읽는다. 화면은 UTC 로 입력받는다 */
export function utcDateTimeToIso(value: string): string {
  return new Date(`${value}:00Z`).toISOString();
}

function isValidDateTime(value: string): boolean {
  return DATE_TIME_PATTERN.test(value) && !Number.isNaN(Date.parse(`${value}:00Z`));
}

const versionBoundSchema = z
  .string()
  .trim()
  .max(MAX_TEXT_LENGTH, `${MAX_TEXT_LENGTH}자 이하로 입력하세요`)
  .refine(
    (version) => version === '' || VERSION_PATTERN.test(version),
    '숫자와 점으로 입력하세요 (예: 1.0.1)',
  );

const tagsSchema = z.array(
  z.string().trim().min(1).max(MAX_TEXT_LENGTH, `${MAX_TEXT_LENGTH}자 이하로 입력하세요`),
);

function dateTimeSchema(emptyMessage: string) {
  return z
    .string()
    .min(1, emptyMessage)
    .refine(isValidDateTime, '날짜와 시각을 모두 입력하세요')
    .transform(utcDateTimeToIso);
}

/**
 * 캠페인 등록 입력 칸마다의 검증. 서버 RegisterCampaignRequest·값 객체 규칙과 맞춘다.
 * 두 칸을 함께 보는 규칙(버전 범위, 기간 순서)은 validateCampaignForm 이 검사한다.
 */
export const campaignFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '캠페인 이름을 입력하세요')
    .max(MAX_NAME_LENGTH, `${MAX_NAME_LENGTH}자 이하로 입력하세요`),
  artifact: z.custom<ArtifactOption>((value) => value !== null, '배포할 파일을 선택하세요'),
  hwVersions: tagsSchema,
  regions: tagsSchema,
  currentVersionMin: versionBoundSchema,
  currentVersionMax: versionBoundSchema,
  startAt: dateTimeSchema('시작 일시를 입력하세요'),
  endAt: dateTimeSchema('종료 일시를 입력하세요'),
});

/** 화면 입력 상태. 파일을 고르기 전에는 artifact 가 null */
export type CampaignFormValues = Omit<z.input<typeof campaignFormSchema>, 'artifact'> & {
  artifact: ArtifactOption | null;
};
export type CampaignFormField = keyof CampaignFormValues;
export type CampaignFormErrors = Partial<Record<CampaignFormField, string>>;
