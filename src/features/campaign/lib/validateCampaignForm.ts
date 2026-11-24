import { z } from 'zod';

import type { RegisterCampaignInput } from '../api/registerCampaign';
import {
  campaignFormSchema,
  type CampaignFormErrors,
  type CampaignFormValues,
} from './campaignFormSchema';
import { compareVersions } from './compareVersions';

export type CampaignFormResult =
  { success: true; input: RegisterCampaignInput } | { success: false; errors: CampaignFormErrors };

type ParsedForm = z.output<typeof campaignFormSchema>;

// 칸마다 형식이 맞을 때만 두 칸을 함께 본다. 서버도 뒤집힌 범위·기간은 거절한다
function crossFieldErrors(form: Partial<ParsedForm>): CampaignFormErrors {
  const errors: CampaignFormErrors = {};
  const { currentVersionMin: min, currentVersionMax: max, startAt, endAt } = form;
  if (min !== undefined && max !== undefined && min !== '' && max !== '') {
    if (compareVersions(min, max) > 0) {
      errors.currentVersionMax = '최대 버전은 최소 버전보다 작을 수 없습니다';
    }
  }
  if (startAt !== undefined && endAt !== undefined && Date.parse(endAt) <= Date.parse(startAt)) {
    errors.endAt = '종료 일시는 시작 일시보다 늦어야 합니다';
  }
  return errors;
}

function parseField(
  field: 'currentVersionMin' | 'currentVersionMax' | 'startAt' | 'endAt',
  values: CampaignFormValues,
): string | undefined {
  const parsed = campaignFormSchema.shape[field].safeParse(values[field]);
  return parsed.success ? parsed.data : undefined;
}

function toInput(form: ParsedForm): RegisterCampaignInput {
  return {
    name: form.name,
    artifactId: form.artifact.artifactId,
    // 서버는 목표 버전·차종이 고른 파일과 같아야 받으므로 파일 값을 그대로 보낸다
    targetVersion: form.artifact.version,
    target: {
      model: form.artifact.model,
      hwVersions: form.hwVersions,
      regions: form.regions,
      currentVersionMin: form.currentVersionMin === '' ? null : form.currentVersionMin,
      currentVersionMax: form.currentVersionMax === '' ? null : form.currentVersionMax,
    },
    startAt: form.startAt,
    endAt: form.endAt,
  };
}

/** 입력값을 검증해 요청 값이나 칸마다 첫 오류 문구를 돌려준다 */
export function validateCampaignForm(values: CampaignFormValues): CampaignFormResult {
  const parsed = campaignFormSchema.safeParse(values);
  // 다른 칸이 틀려도 두 칸 규칙은 함께 알려 주도록 칸마다 따로 읽는다
  const crossErrors = crossFieldErrors({
    currentVersionMin: parseField('currentVersionMin', values),
    currentVersionMax: parseField('currentVersionMax', values),
    startAt: parseField('startAt', values),
    endAt: parseField('endAt', values),
  });
  if (parsed.success && Object.keys(crossErrors).length === 0) {
    return { success: true, input: toInput(parsed.data) };
  }
  const fieldErrors = parsed.success ? {} : z.flattenError(parsed.error).fieldErrors;
  return {
    success: false,
    errors: {
      name: fieldErrors.name?.[0],
      artifact: fieldErrors.artifact?.[0],
      hwVersions: fieldErrors.hwVersions?.[0],
      regions: fieldErrors.regions?.[0],
      currentVersionMin: fieldErrors.currentVersionMin?.[0],
      currentVersionMax: fieldErrors.currentVersionMax?.[0] ?? crossErrors.currentVersionMax,
      startAt: fieldErrors.startAt?.[0],
      endAt: fieldErrors.endAt?.[0] ?? crossErrors.endAt,
    },
  };
}
