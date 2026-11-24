import { MapLegend, type MapLegendItem } from '@/shared/map/MapLegend';
import { TONE_CLASS } from '@/shared/ui/toneClass';

const ITEMS: readonly MapLegendItem[] = [
  { label: 'Edge(정상)', shape: 'dot', colorClass: 'bg-primary' },
  { label: 'Edge(장애)', shape: 'dot', colorClass: TONE_CLASS.danger.dot },
];

type EdgeMapLegendProps = {
  className?: string;
};

/** Edge 마커 색 범례 */
export function EdgeMapLegend({ className }: EdgeMapLegendProps) {
  return <MapLegend items={ITEMS} className={className} />;
}
