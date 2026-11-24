import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';

type EdgeMarkerPopupProps = {
  edge: CdnEdgeStatus;
};

/** Edge 마커를 눌렀을 때 보여 줄 정상 여부와 배정 차량 수 */
export function EdgeMarkerPopup({ edge }: EdgeMarkerPopupProps) {
  return (
    <div className="flex flex-col gap-0.5 font-sans text-xs text-fg">
      <p className="font-bold">
        {edge.name} · {edge.healthy ? '정상' : '장애'}
      </p>
      <p>배정 차량 {edge.assignedVehicles}대</p>
    </div>
  );
}
