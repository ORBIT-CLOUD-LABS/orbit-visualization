import { useId } from 'react';
import { Link } from 'react-router';

import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/cn';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';

import type { ArtifactOption } from '../api/campaignSchemas';

const HELP = '선택한 파일의 차종과 버전이 자동으로 채워집니다';

function optionLabel({ artifactId, model, version, keyId }: ArtifactOption): string {
  return `#${artifactId} · ${model} · ${version} · 서명 키 ${keyId}`;
}

type ArtifactSelectProps = {
  /** 불러오기 전이거나 실패했으면 undefined */
  options: readonly ArtifactOption[] | undefined;
  isPending: boolean;
  onRetry: () => void;
  value: ArtifactOption | null;
  onChange: (artifactId: number | null) => void;
  error?: string;
  disabled?: boolean;
};

/** 배포할 파일 선택. 파일 목록을 불러오는 중·실패·없음 상태를 칸 안에서 보여 준다 */
export function ArtifactSelect({
  options,
  isPending,
  onRetry,
  value,
  onChange,
  error,
  disabled = false,
}: ArtifactSelectProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const isEmpty = options !== undefined && options.length === 0;

  function renderMessage() {
    if (error !== undefined) {
      return <span className="text-danger">{error}</span>;
    }
    if (isEmpty) {
      return (
        <>
          등록된 파일이 없습니다.{' '}
          <Link to={ROUTES.artifactNew} className="text-primary underline">
            파일 등록
          </Link>
        </>
      );
    }
    return HELP;
  }

  if (options === undefined && !isPending) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-fg">배포할 파일</span>
        <Alert
          type="error"
          title="파일 목록을 불러오지 못했습니다"
          action={
            <Button variant="secondary" onClick={onRetry}>
              다시 시도
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="flex gap-1 text-sm font-medium text-fg">
        배포할 파일
        <span aria-hidden="true" className="text-danger">
          *
        </span>
      </label>
      <select
        id={id}
        required
        value={value === null ? '' : String(value.artifactId)}
        disabled={disabled || options === undefined || isEmpty}
        aria-invalid={error !== undefined}
        aria-describedby={messageId}
        onChange={(event) =>
          onChange(event.target.value === '' ? null : Number(event.target.value))
        }
        className={cn(
          'h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-fg',
          'focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
          'disabled:cursor-not-allowed disabled:bg-muted',
          error !== undefined && 'border-line-danger',
        )}
      >
        <option value="">{options === undefined ? '불러오는 중…' : '파일을 선택하세요'}</option>
        {options?.map((option) => (
          <option key={option.artifactId} value={option.artifactId}>
            {optionLabel(option)}
          </option>
        ))}
      </select>
      <p id={messageId} className="text-xs text-fg-muted">
        {renderMessage()}
      </p>
    </div>
  );
}
