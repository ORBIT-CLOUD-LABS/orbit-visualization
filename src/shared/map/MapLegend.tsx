import { cn } from '@/shared/lib/cn';

const SHAPE_CLASS = {
  /** 마커 */
  dot: 'size-2 rounded-full',
  /** 선 */
  line: 'w-3 border-t-2',
} as const;

export type MapLegendItem = {
  label: string;
  shape: keyof typeof SHAPE_CLASS;
  /** 색·선 모양 클래스. 점은 bg-*, 선은 border-* */
  colorClass: string;
};

type MapLegendProps = {
  items: readonly MapLegendItem[];
  className?: string;
};

/** 지도 마커 색과 선 모양 범례 */
export function MapLegend({ items, className }: MapLegendProps) {
  return (
    <ul
      aria-label="지도 범례"
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-sm bg-surface px-2.5 py-1.5 text-2xs text-fg-muted',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1">
          <span aria-hidden="true" className={cn(SHAPE_CLASS[item.shape], item.colorClass)} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
