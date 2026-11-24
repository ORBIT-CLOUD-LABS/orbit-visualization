import { cn } from '@/shared/lib/cn';

import type { ResultRatios } from '../lib/resultRatios';

// 막대와 범례가 같은 색을 쓴다. 색만으로 전하지 않도록 범례에 이름과 비율을 함께 쓴다
const SEGMENTS = [
  { key: 'succeeded', label: '성공', color: 'bg-success' },
  { key: 'failed', label: '실패', color: 'bg-danger' },
  { key: 'inProgress', label: '대기·미보고', color: 'bg-warning' },
] as const;

type ResultBarProps = {
  ratios: ResultRatios;
};

/** 대상 차량 수 기준 결과 비율 막대와 범례 */
export function ResultBar({ ratios }: ResultBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div aria-hidden="true" className="flex h-2 overflow-hidden rounded-full bg-muted">
        {SEGMENTS.map(({ key, color }) => (
          <span key={key} className={color} style={{ width: `${ratios[key]}%` }} />
        ))}
      </div>
      <ul aria-label="결과 비율" className="flex flex-wrap gap-4 text-xs text-fg-muted">
        {SEGMENTS.map(({ key, label, color }) => (
          <li key={key} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn('size-2 rounded-full', color)} />
            {label} {ratios[key]}%
          </li>
        ))}
      </ul>
    </div>
  );
}
