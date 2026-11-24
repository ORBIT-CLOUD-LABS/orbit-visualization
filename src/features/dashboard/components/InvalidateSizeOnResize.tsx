import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/**
 * 지도 영역 크기가 바뀌면 Leaflet 에 다시 재게 한다.
 * Leaflet 은 창 크기 변경에만 크기를 다시 재므로, 옆 카드 높이나 제목 아래 안내 때문에 바뀐 크기를 놓친다
 */
export function InvalidateSizeOnResize() {
  const map = useMap();

  useEffect(() => {
    // jsdom 처럼 ResizeObserver 가 없는 환경에서는 창 크기 변경에만 맞춘다
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(map.getContainer());
    return () => {
      observer.disconnect();
    };
  }, [map]);

  return null;
}
