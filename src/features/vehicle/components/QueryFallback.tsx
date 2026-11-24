import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { SkeletonRow } from '@/shared/ui/SkeletonRow';

const SKELETON_ROWS = [1, 2, 3] as const;

type QueryFallbackProps = {
  isPending: boolean;
  /** 실패 안내 문구. 예: "차량 정보를 불러오지 못했습니다" */
  errorTitle: string;
  /** 서버 응답 code. 없으면 생략 */
  errorCode?: string;
  onRetry: () => void;
};

/** 데이터가 아직 없을 때의 자리. 불러오는 중이면 로딩 행, 실패했으면 다시 시도 안내 */
export function QueryFallback({ isPending, errorTitle, errorCode, onRetry }: QueryFallbackProps) {
  if (isPending) {
    return (
      <div aria-busy="true" className="flex flex-col divide-y divide-line">
        <p className="sr-only">불러오는 중입니다</p>
        {SKELETON_ROWS.map((row) => (
          <SkeletonRow key={row} />
        ))}
      </div>
    );
  }
  return (
    <Alert
      type="error"
      title={`${errorTitle}. 잠시 후 다시 시도해 주세요.`}
      code={errorCode}
      action={
        <Button variant="secondary" onClick={onRetry}>
          다시 시도
        </Button>
      }
    />
  );
}
