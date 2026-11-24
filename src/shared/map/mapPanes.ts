// 선 < 차량 < Edge 순으로 겹치도록 기본 overlayPane(400) 과 markerPane(600) 사이에 둔다.
// SSE 로 마커가 다시 그려져도 순서가 바뀌지 않게 그리는 순서 대신 pane 으로 정한다.
// Leaflet pane 의 z-index 는 CSS 클래스가 아니라 pane 요소 style 로 정한다
export const MAP_PANES = {
  links: { name: 'orbit-links', zIndex: 410 },
  vehicles: { name: 'orbit-vehicles', zIndex: 420 },
  edges: { name: 'orbit-edges', zIndex: 430 },
} as const;
