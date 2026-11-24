import { useId, useState, type KeyboardEvent } from 'react';

import { cn } from '@/shared/lib/cn';

const MAX_LENGTH = 50;

type TagInputProps = {
  label: string;
  values: readonly string[];
  onChange: (values: string[]) => void;
  help?: string;
  error?: string;
  disabled?: boolean;
};

/** 여러 값을 입력하는 칸. Enter 나 칸을 벗어나면 입력한 값을 하나 더한다. 같은 값은 한 번만 넣는다 */
export function TagInput({
  label,
  values,
  onChange,
  help,
  error,
  disabled = false,
}: TagInputProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? help;
  const [draft, setDraft] = useState('');

  function commit() {
    const value = draft.trim();
    setDraft('');
    if (value !== '' && !values.includes(value)) {
      onChange([...values, value]);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    // 한글 조합 중 Enter 는 조합을 끝내는 키다. 여기서 더하면 마지막 글자가 칸에 남아 값이 하나 더 생긴다
    if (event.nativeEvent.isComposing) {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
      return;
    }
    if (event.key === 'Enter') {
      // 폼이 제출되지 않게 막고 값만 더한다
      event.preventDefault();
      commit();
    } else if (event.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      <div
        className={cn(
          'flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5',
          'focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-primary',
          disabled && 'bg-muted',
          error !== undefined && 'border-line-danger',
        )}
      >
        <ul aria-label={`${label} 목록`} className="flex flex-wrap gap-1.5">
          {values.map((value) => (
            <li
              key={value}
              className="flex items-center gap-1 rounded-sm bg-primary-soft px-1.5 font-mono text-2xs text-primary"
            >
              {value}
              <button
                type="button"
                aria-label={`${value} 삭제`}
                disabled={disabled}
                onClick={() => onChange(values.filter((item) => item !== value))}
                className="rounded-xs px-0.5 focus-visible:outline-2 focus-visible:outline-primary"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <input
          id={id}
          value={draft}
          maxLength={MAX_LENGTH}
          placeholder="입력 후 Enter"
          disabled={disabled}
          aria-invalid={error !== undefined}
          aria-describedby={message === undefined ? undefined : messageId}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          className="h-7 min-w-24 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted"
        />
      </div>
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
