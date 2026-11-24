import { describe, expect, it } from 'vitest';

import type { CampaignFormValues } from './campaignFormSchema';
import { validateCampaignForm } from './validateCampaignForm';

const artifact = { artifactId: 12, model: 'MODEL-A', version: '1.1.0', keyId: 'v1' };

const valid: CampaignFormValues = {
  name: ' MODEL-A 1.1.0 배포 ',
  artifact,
  hwVersions: ['HW1', 'HW2'],
  regions: [],
  currentVersionMin: '1.0.0',
  currentVersionMax: '',
  startAt: '2026-10-28T00:00',
  endAt: '2026-11-28T00:00',
};

function errorsOf(values: Partial<CampaignFormValues>) {
  const result = validateCampaignForm({ ...valid, ...values });
  return result.success ? {} : result.errors;
}

describe('validateCampaignForm', () => {
  it('고른 파일의 차종·버전과 UTC 시각으로 요청 값을 만든다', () => {
    expect(validateCampaignForm(valid)).toEqual({
      success: true,
      input: {
        name: 'MODEL-A 1.1.0 배포',
        artifactId: 12,
        targetVersion: '1.1.0',
        target: {
          model: 'MODEL-A',
          hwVersions: ['HW1', 'HW2'],
          regions: [],
          currentVersionMin: '1.0.0',
          currentVersionMax: null,
        },
        startAt: '2026-10-28T00:00:00.000Z',
        endAt: '2026-11-28T00:00:00.000Z',
      },
    });
  });

  it('필수값이 비면 칸마다 알려 준다', () => {
    expect(errorsOf({ name: ' ', artifact: null, startAt: '', endAt: '' })).toMatchObject({
      name: '캠페인 이름을 입력하세요',
      artifact: '배포할 파일을 선택하세요',
      startAt: '시작 일시를 입력하세요',
      endAt: '종료 일시를 입력하세요',
    });
  });

  it('이름은 100자까지 받는다', () => {
    expect(errorsOf({ name: '가'.repeat(100) }).name).toBeUndefined();
    expect(errorsOf({ name: '가'.repeat(101) }).name).toBe('100자 이하로 입력하세요');
  });

  it.each(['v1.0', '1.0.', '1.0-beta'])('현재 버전 %s 는 거절한다', (version) => {
    expect(errorsOf({ currentVersionMin: version }).currentVersionMin).toBe(
      '숫자와 점으로 입력하세요 (예: 1.0.1)',
    );
  });

  it('최소 버전이 최대 버전보다 크면 거절한다. 자리마다 숫자로 비교한다', () => {
    expect(
      errorsOf({ currentVersionMin: '1.0.10', currentVersionMax: '1.0.9' }).currentVersionMax,
    ).toBe('최대 버전은 최소 버전보다 작을 수 없습니다');
    expect(
      errorsOf({ currentVersionMin: '1.0.9', currentVersionMax: '1.0.10' }).currentVersionMax,
    ).toBeUndefined();
  });

  it('종료 일시가 시작 일시보다 늦지 않으면 다른 칸 오류와 함께 알려 준다', () => {
    expect(errorsOf({ name: '', endAt: '2026-10-28T00:00' })).toMatchObject({
      name: '캠페인 이름을 입력하세요',
      endAt: '종료 일시는 시작 일시보다 늦어야 합니다',
    });
  });

  it('HW 버전·지역은 50자까지 받는다', () => {
    expect(errorsOf({ regions: ['K'.repeat(51)] }).regions).toBe('50자 이하로 입력하세요');
  });
});
