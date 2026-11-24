import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import { TONE_CLASS, type Tone } from './toneClass';

export type AlertType = 'error' | 'warning' | 'info';

const ALERT_TONE: Record<AlertType, Tone> = {
  error: 'danger',
  warning: 'warning',
  info: 'info',
};

type AlertProps = {
  type: AlertType;
  title: string;
  /** 제목 아래 사람이 읽는 안내. 예: 다음에 확인할 것 */
  description?: string;
  /** 서버 응답 code 처럼 사람이 아닌 도구가 읽는 값 */
  code?: string;
  /** 오른쪽에 둘 동작. 예: 다시 시도 버튼 */
  action?: ReactNode;
  className?: string;
};

export function Alert({ type, title, description, code, action, className }: AlertProps) {
  const typeClass = TONE_CLASS[ALERT_TONE[type]];

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-3.5 py-3',
        typeClass.surface,
        className,
      )}
    >
      <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', typeClass.dot)} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm font-medium">{title}</p>
        {description !== undefined && <p className="text-2xs">{description}</p>}
        {code !== undefined && <p className="font-mono text-2xs break-all">{code}</p>}
      </div>
      {action}
    </div>
  );
}
