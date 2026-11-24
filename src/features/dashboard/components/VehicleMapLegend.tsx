import { cn } from '@/shared/lib/cn';

const DOT_ITEMS = [
  { label: 'Edge', className: 'bg-primary' },
  { label: '차량(정상)', className: 'bg-success' },
  { label: '차량(실패)', className: 'bg-danger' },
  { label: '차량(결과 없음)', className: 'bg-neutral' },
] as const;

const LINE_ITEMS = [
  { label: '배정 Edge', className: 'border-t-2 border-primary' },
  { label: '재배정', className: 'border-t-2 border-dashed border-warning' },
] as const;

type VehicleMapLegendProps = {
  className?: string;
};

/** 지도 마커 색과 선 모양 범례 */
export function VehicleMapLegend({ className }: VehicleMapLegendProps) {
  return (
    <ul
      aria-label="지도 범례"
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-sm bg-surface px-2.5 py-1.5 text-2xs text-fg-muted',
        className,
      )}
    >
      {DOT_ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-1">
          <span aria-hidden="true" className={cn('size-2 rounded-full', item.className)} />
          {item.label}
        </li>
      ))}
      {LINE_ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-1">
          <span aria-hidden="true" className={cn('w-3', item.className)} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
