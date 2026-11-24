import { clsx } from 'clsx';
import { useId, type ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/lib/cn';

type InputProps = Omit<ComponentPropsWithRef<'input'>, 'id'> & {
  label: string;
  /** true 면 label 을 화면에서 숨기고 화면 읽기 도구에만 남긴다. 검색창처럼 placeholder 로 뜻이 보일 때 쓴다 */
  hideLabel?: boolean;
  /** 입력 아래 안내 문구. error 가 있으면 대신 error 를 보여 준다 */
  help?: string;
  error?: string;
};

export function Input({
  label,
  hideLabel = false,
  help,
  error,
  required,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? help;
  // id 목록이라 tailwind-merge 를 거치지 않도록 cn 대신 clsx 로 합친다
  const describedBy = clsx(ariaDescribedBy, message !== undefined && messageId);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className={cn('flex gap-1 text-sm font-medium text-fg', hideLabel && 'sr-only')}
      >
        {label}
        {required === true && (
          <span aria-hidden="true" className="text-danger">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        required={required}
        aria-invalid={error === undefined ? ariaInvalid : true}
        aria-describedby={describedBy === '' ? undefined : describedBy}
        className={cn(
          'h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-fg placeholder:text-fg-muted',
          'focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary',
          'disabled:cursor-not-allowed disabled:bg-muted',
          error !== undefined && 'border-line-danger',
        )}
        {...props}
      />
      {message !== undefined && (
        <p
          id={messageId}
          className={cn('text-xs', error === undefined ? 'text-fg-muted' : 'text-danger')}
        >
          {message}
        </p>
      )}
    </div>
  );
}
