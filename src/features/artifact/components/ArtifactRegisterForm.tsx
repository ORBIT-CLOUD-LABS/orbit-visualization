import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

import { ROUTES } from '@/shared/config/routes';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import { Input } from '@/shared/ui/Input';

import type { RegisterArtifactInput } from '../api/registerArtifact';
import type {
  ArtifactFormErrors,
  ArtifactFormField,
  ArtifactFormValues,
} from '../lib/artifactFormSchema';
import { registerErrorMessage } from '../lib/registerErrorMessage';
import { validateArtifactForm } from '../lib/validateArtifactForm';
import { FileDropzone } from './FileDropzone';

const EMPTY_VALUES: ArtifactFormValues = {
  file: null,
  model: '',
  version: '',
  sha256: '',
  signature: '',
  keyId: '',
};

type ArtifactRegisterFormProps = {
  isSubmitting: boolean;
  /** 마지막 등록 요청의 실패. 없으면 null */
  error: Error | null;
  onSubmit: (input: RegisterArtifactInput) => void;
};

export function ArtifactRegisterForm({ isSubmitting, error, onSubmit }: ArtifactRegisterFormProps) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState<ArtifactFormErrors>({});
  const serverError = error === null ? null : registerErrorMessage(error);

  function change<Field extends ArtifactFormField>(field: Field, value: ArtifactFormValues[Field]) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateArtifactForm(values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    onSubmit(result.input);
  }

  return (
    <form
      noValidate
      aria-label="파일 등록"
      onSubmit={handleSubmit}
      className="flex min-w-0 flex-1 flex-col gap-5 rounded-xl border border-line bg-surface p-7"
    >
      <h2 className="text-md font-bold text-fg">업데이트 파일</h2>
      <FileDropzone
        file={values.file}
        onChange={(file) => change('file', file)}
        error={errors.file}
        disabled={isSubmitting}
      />
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          label="차종"
          required
          className="flex-1"
          value={values.model}
          onChange={(event) => change('model', event.target.value)}
          help="`/` 는 사용할 수 없습니다"
          error={errors.model}
          disabled={isSubmitting}
        />
        <Input
          label="버전"
          required
          className="flex-1"
          value={values.version}
          onChange={(event) => change('version', event.target.value)}
          help="서명할 때 쓴 버전과 똑같이 입력하세요 (1.0 과 1.0.0 은 다름)"
          error={errors.version}
          disabled={isSubmitting}
        />
      </div>
      <Input
        label="SHA-256 (선택)"
        value={values.sha256}
        onChange={(event) => change('sha256', event.target.value)}
        placeholder="hex 64자"
        help="입력하면 서버가 계산한 값과 비교합니다"
        error={errors.sha256}
        disabled={isSubmitting}
      />
      <div className="flex flex-col gap-0.5">
        <h2 className="text-md font-bold text-fg">펌웨어 서명</h2>
        <p className="text-xs text-fg-muted">
          Vault 서명 결과 vault:v1:&lt;서명값&gt; 에서 v1 은 키 버전, 나머지는 서명 칸에 입력하세요
        </p>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          label="서명"
          required
          className="flex-1"
          value={values.signature}
          onChange={(event) => change('signature', event.target.value)}
          placeholder="base64 64바이트"
          error={errors.signature}
          disabled={isSubmitting}
        />
        <Input
          label="키 버전"
          required
          className="md:w-40"
          value={values.keyId}
          onChange={(event) => change('keyId', event.target.value)}
          placeholder="v1"
          error={errors.keyId}
          disabled={isSubmitting}
        />
      </div>
      {serverError !== null && (
        <Alert type="error" title={serverError.title} description={serverError.description} />
      )}
      <div className="flex justify-end gap-2">
        <Link to={ROUTES.artifacts} className={buttonClassName({ variant: 'secondary' })}>
          취소
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '등록 중…' : '등록'}
        </Button>
      </div>
    </form>
  );
}
