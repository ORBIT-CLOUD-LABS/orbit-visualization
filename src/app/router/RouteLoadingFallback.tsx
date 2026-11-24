import { SkeletonRow } from '@/shared/ui/SkeletonRow';

/** 첫 접속 때 화면 코드를 받는 동안 보여 주는 자리. 이후 이동에서는 라우터가 이전 화면을 유지한다 */
export function RouteLoadingFallback() {
  return (
    <div aria-busy="true" className="flex flex-col gap-2 p-6">
      <output className="sr-only">화면을 불러오는 중입니다</output>
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  );
}
