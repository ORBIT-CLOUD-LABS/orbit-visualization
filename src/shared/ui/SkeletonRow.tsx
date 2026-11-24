import { cn } from '@/shared/lib/cn';

type SkeletonRowProps = {
  className?: string;
};

/**
 * 로딩 중인 목록 행 자리. 화면 읽기 도구에는 숨기므로,
 * 감싸는 영역에 aria-busy 나 "불러오는 중" 같은 글자를 따로 둔다.
 */
export function SkeletonRow({ className }: SkeletonRowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('flex animate-pulse gap-4 bg-surface px-4 py-3', className)}
    >
      <span className="h-3 w-30 rounded-sm bg-muted" />
      <span className="h-3 w-50 rounded-sm bg-muted" />
      <span className="h-3 w-20 rounded-sm bg-muted" />
      <span className="h-3 w-25 rounded-sm bg-muted" />
    </div>
  );
}
