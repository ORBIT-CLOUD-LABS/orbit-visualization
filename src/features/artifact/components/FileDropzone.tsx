import { useId } from 'react';

import { cn } from '@/shared/lib/cn';

import { formatByteCount } from '../lib/formatFileSize';

type FileDropzoneProps = {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
};

/**
 * 파일 선택 칸. 투명한 file input 이 칸 전체를 덮어,
 * 누르면 파일 선택 창이 열리고 끌어다 놓으면 브라우저가 input 에 파일을 넣는다.
 */
export function FileDropzone({ file, onChange, error, disabled = false }: FileDropzoneProps) {
  const errorId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          'relative flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-accent-soft bg-subtle px-6 py-7 text-center',
          'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary',
          disabled && 'opacity-50',
          error !== undefined && 'border-line-danger',
        )}
      >
        <span aria-hidden="true" className="size-9 rounded-md bg-primary-soft" />
        {file !== null && (
          <span className="text-sm font-medium text-fg">
            {file.name} · {formatByteCount(file.size)}
          </span>
        )}
        <span className="text-xs text-fg-muted">
          파일을 끌어다 놓거나 클릭해서 선택하세요 (최대 1GB)
        </span>
        <input
          type="file"
          aria-label="업데이트 파일"
          aria-invalid={error !== undefined}
          aria-describedby={error === undefined ? undefined : errorId}
          disabled={disabled}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
      </div>
      {error !== undefined && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
