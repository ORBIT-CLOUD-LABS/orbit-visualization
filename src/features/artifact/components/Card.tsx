import { useId, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type CardProps = {
  title: string;
  description?: string;
  /** 제목 오른쪽 동작. 예: 필터, 등록 버튼 */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** 제목으로 이름 붙인 영역(region). 화면 읽기 도구가 카드 단위로 이동할 수 있다 */
export function Card({ title, description, action, children, className }: CardProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn('flex flex-col gap-4 rounded-xl border border-line bg-surface p-5', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id={titleId} className="text-md font-bold text-fg">
            {title}
          </h2>
          {description !== undefined && <p className="text-xs text-fg-muted">{description}</p>}
        </div>
        {action !== undefined && <div className="flex items-center gap-2">{action}</div>}
      </div>
      {children}
    </section>
  );
}
