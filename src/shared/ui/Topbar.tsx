import type { ReactNode } from 'react';

type TopbarProps = {
  title: string;
  subtitle?: string;
  /** 오른쪽 영역. 예: 실시간 연결 상태, 마지막 갱신 시각, 버튼 */
  right?: ReactNode;
};

export function Topbar({ title, subtitle, right }: TopbarProps) {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-line bg-surface px-8 py-2">
      <div className="flex min-w-0 flex-col gap-0.5">
        <h1 className="text-lg font-bold text-fg">{title}</h1>
        {subtitle !== undefined && <p className="text-xs text-fg-muted">{subtitle}</p>}
      </div>
      {right !== undefined && <div className="flex shrink-0 items-center gap-4">{right}</div>}
    </header>
  );
}
