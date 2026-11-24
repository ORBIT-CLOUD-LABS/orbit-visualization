import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { SkeletonRow } from '@/shared/ui/SkeletonRow';

const ROW_KEYS = ['first', 'second', 'third'] as const;

type QueryFallbackProps = {
  isPending: boolean;
  onRetry: () => void;
};

/** 데이터가 아직 없을 때의 자리. 불러오는 중이면 로딩 행, 실패했으면 다시 시도 안내 */
export function QueryFallback({ isPending, onRetry }: QueryFallbackProps) {
  if (!isPending) {
    // 서버 응답 원문은 보여 주지 않는다
    return (
      <Alert
        type="error"
        title="데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        action={
          <Button variant="secondary" onClick={onRetry}>
            다시 시도
          </Button>
        }
      />
    );
  }
  return (
    <div aria-busy="true" className="overflow-hidden rounded-lg border border-line">
      <p className="sr-only">불러오는 중</p>
      {ROW_KEYS.map((key) => (
        <SkeletonRow key={key} />
      ))}
    </div>
  );
}
