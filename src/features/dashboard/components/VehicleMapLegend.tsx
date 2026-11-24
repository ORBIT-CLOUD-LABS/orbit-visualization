import { cn } from '@/shared/lib/cn';
import { TONE_CLASS } from '@/shared/ui/toneClass';

const DOT_CLASS = 'size-2 rounded-full';
const LINE_CLASS = 'w-3 border-t-2';

const ITEMS = [
  { label: 'Edge', swatch: cn(DOT_CLASS, 'bg-primary') },
  { label: '차량(정상)', swatch: cn(DOT_CLASS, TONE_CLASS.success.dot) },
  { label: '차량(실패)', swatch: cn(DOT_CLASS, TONE_CLASS.danger.dot) },
  { label: '차량(결과 없음)', swatch: cn(DOT_CLASS, TONE_CLASS.neutral.dot) },
  { label: '배정 Edge', swatch: cn(LINE_CLASS, 'border-primary') },
  { label: '재배정', swatch: cn(LINE_CLASS, 'border-dashed border-warning') },
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
      {ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-1">
          <span aria-hidden="true" className={item.swatch} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
