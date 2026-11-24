type MapEmptyNoticeProps = {
  children: string;
};

/** 그릴 마커가 없을 때 지도 가운데 띄우는 안내. BaseMap 의 overlay 로 넘긴다 */
export function MapEmptyNotice({ children }: MapEmptyNoticeProps) {
  return (
    <p className="pointer-events-none absolute inset-x-0 top-1/2 z-1000 mx-auto w-fit -translate-y-1/2 rounded-sm bg-surface px-3 py-1.5 text-xs text-fg-muted">
      {children}
    </p>
  );
}
