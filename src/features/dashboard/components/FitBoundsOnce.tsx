import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

import type { MapBounds } from '../lib/computeMapBounds';

const FIT_PADDING: [number, number] = [24, 24];
// 점이 하나뿐이어도 주변이 보이도록 너무 가까이 확대하지 않는다
const FIT_MAX_ZOOM = 12;

type FitBoundsOnceProps = {
  /** 맞출 범위. 아직 맞출 준비가 안 됐으면 null */
  bounds: MapBounds | null;
};

/** 처음 받은 범위로 한 번만 화면을 맞춘다. 이후 갱신에서는 사용자가 옮긴 화면을 유지한다 */
export function FitBoundsOnce({ bounds }: FitBoundsOnceProps) {
  const map = useMap();
  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (hasFittedRef.current || bounds === null) {
      return;
    }
    hasFittedRef.current = true;
    map.fitBounds(bounds, { padding: FIT_PADDING, maxZoom: FIT_MAX_ZOOM });
  }, [map, bounds]);

  return null;
}
