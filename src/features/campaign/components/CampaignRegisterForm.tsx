import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

import { ROUTES } from '@/shared/config/routes';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import { Input } from '@/shared/ui/Input';

import type { ArtifactOption } from '../api/campaignSchemas';
import type { RegisterCampaignInput } from '../api/registerCampaign';
import type { CampaignFormErrors, CampaignFormValues } from '../lib/campaignFormSchema';
import { registerErrorMessage } from '../lib/registerErrorMessage';
import { validateCampaignForm } from '../lib/validateCampaignForm';
import { ArtifactSelect } from './ArtifactSelect';
import { TagInput } from './TagInput';

/** 파일 선택은 목록을 불러온 뒤에 찾으므로 id 로 들고 있는다 */
type FormState = Omit<CampaignFormValues, 'artifact'> & { artifactId: number | null };
type FormField = keyof FormState;

const UTC_HELP = 'UTC 기준';

type CampaignRegisterFormProps = {
  artifactOptions: readonly ArtifactOption[] | undefined;
  isArtifactsPending: boolean;
  onRetryArtifacts: () => void;
  /** 처음 골라 둘 파일. 목록에 없으면 고르지 않는다 */
  initialArtifactId: number | null;
  isSubmitting: boolean;
  /** 마지막 등록 요청의 실패. 없으면 null */
  error: Error | null;
  /** 입력이 바뀔 때마다 부른다 */
  onEdit: () => void;
  onSubmit: (input: RegisterCampaignInput) => void;
};

export function CampaignRegisterForm({
  artifactOptions,
  isArtifactsPending,
  onRetryArtifacts,
  initialArtifactId,
  isSubmitting,
  error,
  onEdit,
  onSubmit,
}: CampaignRegisterFormProps) {
  const [values, setValues] = useState<FormState>({
    name: '',
    artifactId: initialArtifactId,
    hwVersions: [],
    regions: [],
    currentVersionMin: '',
    currentVersionMax: '',
    startAt: '',
    endAt: '',
  });
  const [errors, setErrors] = useState<CampaignFormErrors>({});
  const artifact = artifactOptions?.find(({ artifactId }) => artifactId === values.artifactId);
  const serverError = error === null ? null : registerErrorMessage(error);

  function change<Field extends FormField>(field: Field, value: FormState[Field]) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({
      ...previous,
      [field === 'artifactId' ? 'artifact' : field]: undefined,
    }));
    onEdit();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { artifactId: _artifactId, ...rest } = values;
    const result = validateCampaignForm({ ...rest, artifact: artifact ?? null });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    onSubmit(result.input);
  }

  return (
    <form
      noValidate
      aria-label="캠페인 등록"
      onSubmit={handleSubmit}
      className="flex min-w-0 flex-1 flex-col gap-5 rounded-xl border border-line bg-surface p-7"
    >
      <h2 className="text-md font-bold text-fg">기본 정보</h2>
      <Input
        label="캠페인 이름"
        required
        value={values.name}
        onChange={(event) => change('name', event.target.value)}
        placeholder="예: MODEL-A 1.1.0 배포"
        error={errors.name}
        disabled={isSubmitting}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <ArtifactSelect
          options={artifactOptions}
          isPending={isArtifactsPending}
          onRetry={onRetryArtifacts}
          value={artifact ?? null}
          onChange={(artifactId) => change('artifactId', artifactId)}
          error={errors.artifact}
          disabled={isSubmitting}
        />
        <Input
          label="목표 버전"
          required
          readOnly
          value={artifact?.version ?? ''}
          placeholder="파일을 선택하세요"
          help="선택한 파일의 버전으로 고정됩니다"
        />
      </div>

      <div className="flex flex-col gap-0.5">
        <h2 className="text-md font-bold text-fg">대상 차량 조건</h2>
        <p className="text-xs text-fg-muted">
          지역은 차량에 등록된 지역 기준이며, 차량의 현재 위치와는 관계없습니다
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="차종"
          required
          readOnly
          value={artifact?.model ?? ''}
          placeholder="파일을 선택하세요"
          help="선택한 파일의 차종으로 고정됩니다"
        />
        <TagInput
          label="HW 버전"
          values={values.hwVersions}
          onChange={(hwVersions) => change('hwVersions', hwVersions)}
          help="비워 두면 모든 HW 버전이 대상입니다"
          error={errors.hwVersions}
          disabled={isSubmitting}
        />
        <TagInput
          label="지역"
          values={values.regions}
          onChange={(regions) => change('regions', regions)}
          help="비워 두면 모든 지역이 대상입니다"
          error={errors.regions}
          disabled={isSubmitting}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="현재 버전 (최소)"
            value={values.currentVersionMin}
            onChange={(event) => change('currentVersionMin', event.target.value)}
            placeholder="제한 없음"
            error={errors.currentVersionMin}
            disabled={isSubmitting}
          />
          <Input
            label="현재 버전 (최대)"
            value={values.currentVersionMax}
            onChange={(event) => change('currentVersionMax', event.target.value)}
            placeholder="제한 없음"
            error={errors.currentVersionMax}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <h2 className="text-md font-bold text-fg">적용 기간</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          type="datetime-local"
          label="시작 일시"
          required
          value={values.startAt}
          onChange={(event) => change('startAt', event.target.value)}
          help={UTC_HELP}
          error={errors.startAt}
          disabled={isSubmitting}
        />
        <Input
          type="datetime-local"
          label="종료 일시"
          required
          value={values.endAt}
          onChange={(event) => change('endAt', event.target.value)}
          help={UTC_HELP}
          error={errors.endAt}
          disabled={isSubmitting}
        />
      </div>

      {serverError !== null && (
        <Alert type="error" title={serverError.title} description={serverError.description} />
      )}
      <div className="flex justify-end gap-2">
        <Link to={ROUTES.campaigns} className={buttonClassName({ variant: 'secondary' })}>
          취소
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '등록 중…' : '캠페인 등록'}
        </Button>
      </div>
    </form>
  );
}
