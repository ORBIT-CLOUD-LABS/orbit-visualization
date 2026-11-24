import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

import type { MapBounds } from './computeMapBounds';

const FIT_PADDING: [number, number] = [24, 24];
// 점이 하나뿐이어도 주변이 보이도록 너무 가까이 확대하지 않는다
const FIT_MAX_ZOOM = 12;

type FitBoundsOnceProps = {
  /**
   * 맞출 범위를 계산한다. 아직 맞출 준비가 안 됐으면 null.
   * 계산 결과가 null(좌표 없음)이면 맞춘 것으로 치지 않는다. 맞춘 뒤에는 같은 fitKey 동안 부르지 않는다
   */
  getBounds: (() => MapBounds | null) | null;
  /** 이 값이 바뀌면 한 번 더 맞춘다. 예: 대상 위치가 바뀌었을 때. 기본은 처음 한 번만 */
  fitKey?: string;
};

/** 처음 받은 범위로 한 번만 화면을 맞춘다. 이후 갱신에서는 사용자가 옮긴 화면을 유지한다 */
export function FitBoundsOnce({ getBounds, fitKey = '' }: FitBoundsOnceProps) {
  const map = useMap();
  const fittedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (fittedKeyRef.current === fitKey || getBounds === null) {
      return;
    }
    const bounds = getBounds();
    // 맞출 좌표가 아직 없으면 맞춘 것으로 치지 않고 다음에 다시 계산한다
    if (bounds === null) {
      return;
    }
    fittedKeyRef.current = fitKey;
    // 같은 렌더에서 카드 높이가 바뀌었을 수 있어 크기를 먼저 다시 잰다
    map.invalidateSize();
    map.fitBounds(bounds, { padding: FIT_PADDING, maxZoom: FIT_MAX_ZOOM });
  }, [map, getBounds, fitKey]);

  return null;
}
