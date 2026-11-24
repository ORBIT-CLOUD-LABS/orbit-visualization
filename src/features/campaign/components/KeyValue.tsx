import type { ReactNode } from 'react';

type KeyValueProps = {
  label: string;
  children: ReactNode;
};

/** 상세 정보 한 칸. 값은 고정폭 글꼴로 그린다 */
export function KeyValue({ label, children }: KeyValueProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-xs text-fg-muted">{label}</dt>
      <dd className="font-mono text-xs break-all text-fg">{children}</dd>
    </div>
  );
}
