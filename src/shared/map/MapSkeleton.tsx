import { cn } from '@/shared/lib/cn';

type MapSkeletonProps = {
  /** 화면 읽기 도구에 알릴 문구. 예: "차량 위치를 불러오는 중입니다" */
  label: string;
  /** 지도와 같은 크기를 준다 */
  className?: string;
};

/** 지도에 그릴 데이터를 불러오는 동안 지도 자리를 채운다 */
export function MapSkeleton({ label, className }: MapSkeletonProps) {
  return (
    <div aria-busy="true" className={cn('animate-pulse rounded-lg bg-map', className)}>
      <p className="sr-only">{label}</p>
    </div>
  );
}
