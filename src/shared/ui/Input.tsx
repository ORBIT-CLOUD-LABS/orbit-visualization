import { useId, type ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/lib/cn';

type InputProps = Omit<ComponentPropsWithRef<'input'>, 'id'> & {
  label: string;
  /** 입력 아래 안내 문구. error 가 있으면 대신 error 를 보여 준다 */
  help?: string;
  error?: string;
};

export function Input({ label, help, error, required, className, ...props }: InputProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? help;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="flex gap-1 text-sm font-medium text-fg">
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
        aria-invalid={error === undefined ? undefined : true}
        aria-describedby={message === undefined ? undefined : messageId}
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
