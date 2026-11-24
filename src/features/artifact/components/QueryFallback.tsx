import { LoadErrorAlert } from '@/shared/ui/LoadErrorAlert';
import { LoadingRows } from '@/shared/ui/LoadingRows';

type QueryFallbackProps = {
  isPending: boolean;
  onRetry: () => void;
};

/** 데이터가 아직 없을 때의 자리. 불러오는 중이면 로딩 행, 실패했으면 다시 시도 안내 */
export function QueryFallback({ isPending, onRetry }: QueryFallbackProps) {
  return isPending ? <LoadingRows /> : <LoadErrorAlert onRetry={onRetry} />;
}
