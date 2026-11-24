import { cn } from '@/shared/lib/cn';
import { TONE_CLASS } from '@/shared/ui/toneClass';

const DOT_CLASS = 'size-2 rounded-full';

const ITEMS = [
  { label: 'Edge(정상)', swatch: cn(DOT_CLASS, 'bg-primary') },
  { label: 'Edge(장애)', swatch: cn(DOT_CLASS, TONE_CLASS.danger.dot) },
] as const;

type EdgeMapLegendProps = {
  className?: string;
};

/** Edge 마커 색 범례 */
export function EdgeMapLegend({ className }: EdgeMapLegendProps) {
  return (
    <ul
      aria-label="지도 범례"
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-sm bg-surface px-2.5 py-1.5 text-2xs text-fg-muted',
        className,
      )}
    >
      {ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-1">
          <span aria-hidden="true" className={item.swatch} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
