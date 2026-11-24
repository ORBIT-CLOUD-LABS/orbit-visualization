import { MapLegend, type MapLegendItem } from '@/shared/map/MapLegend';
import { TONE_CLASS } from '@/shared/ui/toneClass';

const ITEMS: readonly MapLegendItem[] = [
  { label: 'Edge', shape: 'dot', colorClass: 'bg-primary' },
  { label: '차량(정상)', shape: 'dot', colorClass: TONE_CLASS.success.dot },
  { label: '차량(실패)', shape: 'dot', colorClass: TONE_CLASS.danger.dot },
  { label: '차량(결과 없음)', shape: 'dot', colorClass: TONE_CLASS.neutral.dot },
  { label: '배정 Edge', shape: 'line', colorClass: 'border-primary' },
  { label: '재배정', shape: 'line', colorClass: 'border-dashed border-warning' },
];

type VehicleMapLegendProps = {
  className?: string;
};

/** 차량·Edge 마커 색과 배정 선 모양 범례 */
export function VehicleMapLegend({ className }: VehicleMapLegendProps) {
  return <MapLegend items={ITEMS} className={className} />;
}
