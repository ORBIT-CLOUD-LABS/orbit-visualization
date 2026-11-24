import { usePagination } from '@/shared/lib/usePagination';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Pagination } from '@/shared/ui/Pagination';
import { QueryFallback } from '@/shared/ui/QueryFallback';

import type { VehicleUpdateEvent } from '../api/vehicleSchemas';

import { UpdateHistoryTable } from './UpdateHistoryTable';

const NO_EVENTS: readonly VehicleUpdateEvent[] = [];

type UpdateHistoryCardProps = {
  /** 아직 받지 못했으면 undefined */
  events: readonly VehicleUpdateEvent[] | undefined;
  isPending: boolean;
  errorCode?: string;
  onRetry: () => void;
};

/** 업데이트 시도 이력. 서버가 준 순서(완료 시각 늦은 순) 그대로 20개씩 나눠 보여 준다 */
export function UpdateHistoryCard({
  events,
  isPending,
  errorCode,
  onRetry,
}: UpdateHistoryCardProps) {
  const pagination = usePagination(events ?? NO_EVENTS);

  function renderBody() {
    if (events === undefined) {
      return (
        <QueryFallback
          isPending={isPending}
          loadingLabel="불러오는 중입니다"
          loadingVariant="divided"
          errorMessage="업데이트 이력을 불러오지 못했습니다"
          errorCode={errorCode}
          onRetry={onRetry}
        />
      );
    }
    if (events.length === 0) {
      return (
        <EmptyState
          title="업데이트 이력이 없습니다"
          description="이 차량이 업데이트 결과를 보고하면 여기에 표시됩니다"
        />
      );
    }
    return (
      <>
        <UpdateHistoryTable events={pagination.pageItems} />
        <Pagination
          page={pagination.page}
          pageCount={pagination.pageCount}
          onPageChange={pagination.setPage}
          summary={`${pagination.totalCount}건 중 ${pagination.rangeStart}–${pagination.rangeEnd} · ${pagination.page} / ${pagination.pageCount} 페이지`}
        />
      </>
    );
  }

  return (
    <Card className="p-6" title="업데이트 이력" description="최근 50건 · 완료 시각 늦은 순">
      {renderBody()}
    </Card>
  );
}
