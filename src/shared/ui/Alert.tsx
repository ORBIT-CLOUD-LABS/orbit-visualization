import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export type AlertType = 'error' | 'warning' | 'info';

const TYPE_CLASS: Record<AlertType, { alert: string; dot: string }> = {
  error: { alert: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  warning: { alert: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  info: { alert: 'bg-info-soft text-info', dot: 'bg-info' },
};

type AlertProps = {
  type: AlertType;
  title: string;
  /** 서버 응답 code 처럼 사람이 아닌 도구가 읽는 값 */
  code?: string;
  /** 오른쪽에 둘 동작. 예: 다시 시도 버튼 */
  action?: ReactNode;
  className?: string;
};

export function Alert({ type, title, code, action, className }: AlertProps) {
  const typeClass = TYPE_CLASS[type];

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={cn('flex items-center gap-2.5 rounded-md px-3.5 py-3', typeClass.alert, className)}
    >
      <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', typeClass.dot)} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm font-medium">{title}</p>
        {code !== undefined && <p className="font-mono text-2xs break-all">{code}</p>}
      </div>
      {action}
    </div>
  );
}
