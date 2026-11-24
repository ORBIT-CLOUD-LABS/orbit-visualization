import { useId, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type CardProps = {
  title: ReactNode;
  description?: string;
  /** 제목 옆에 붙는 표시. 예: 결과 배지 */
  badge?: ReactNode;
  /** 제목 오른쪽 동작. 예: 새로고침 버튼 */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** 제목으로 이름 붙인 영역(region). 화면 읽기 도구가 카드 단위로 이동할 수 있다 */
export function Card({ title, description, badge, action, children, className }: CardProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn('flex flex-col gap-4 rounded-xl border border-line bg-surface p-6', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id={titleId} className="text-md font-bold text-fg">
              {title}
            </h2>
            {badge}
          </div>
          {description !== undefined && <p className="text-xs text-fg-muted">{description}</p>}
        </div>
        {action !== undefined && <div className="flex items-center gap-2">{action}</div>}
      </div>
      {children}
    </section>
  );
}
