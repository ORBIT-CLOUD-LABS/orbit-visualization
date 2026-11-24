type MapSkeletonProps = {
  /** 화면 읽기 도구에 알릴 문구. 예: "차량 위치를 불러오는 중입니다" */
  label: string;
};

/** 지도에 그릴 데이터를 불러오는 동안 지도 자리를 채운다. 카드 지도와 같은 크기를 쓴다 */
export function MapSkeleton({ label }: MapSkeletonProps) {
  return (
    <div aria-busy="true" className="min-h-52.5 flex-1 animate-pulse rounded-lg bg-map">
      <p className="sr-only">{label}</p>
    </div>
  );
}
