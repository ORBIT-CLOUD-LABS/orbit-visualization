import { SkeletonRow } from '@/shared/ui/SkeletonRow';

const ROW_KEYS = ['first', 'second', 'third'] as const;

export function LoadingRows() {
  return (
    <div aria-busy="true" className="overflow-hidden rounded-lg border border-line">
      <p className="sr-only">불러오는 중</p>
      {ROW_KEYS.map((key) => (
        <SkeletonRow key={key} />
      ))}
    </div>
  );
}
