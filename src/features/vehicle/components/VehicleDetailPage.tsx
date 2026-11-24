import { Link, useParams } from 'react-router';

import { ApiError } from '@/shared/api/ApiError';
import { ROUTES } from '@/shared/config/routes';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Topbar } from '@/shared/ui/Topbar';

import { useVehicleDetail } from '../hooks/useVehicleDetail';
import { useVehicleUpdateHistory } from '../hooks/useVehicleUpdateHistory';
import { parseVehicleId } from '../lib/parseVehicleId';

import { Card } from './Card';
import { LastUpdateCard } from './LastUpdateCard';
import { QueryFallback } from './QueryFallback';
import { UpdateHistoryCard } from './UpdateHistoryCard';
import { VehicleBreadcrumb } from './VehicleBreadcrumb';
import { VehicleLocationCard } from './VehicleLocationCard';
import { VehicleSummaryCard } from './VehicleSummaryCard';

const NOT_FOUND = 404;
// 버튼을 여러 번 눌러도 진행 중인 요청을 취소하고 다시 보내지 않는다
const KEEP_IN_FLIGHT = { cancelRefetch: false } as const;

function errorCodeOf(error: unknown): string | undefined {
  return error instanceof ApiError ? error.code : undefined;
}

/** 03 차량 상세. 실시간 갱신 없이 새로고침 버튼으로 다시 불러온다 */
export function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = parseVehicleId(params.vehicleId);
  const detail = useVehicleDetail(vehicleId);
  const history = useVehicleUpdateHistory(vehicleId);
  const isNotFound =
    vehicleId === null || (detail.error instanceof ApiError && detail.error.status === NOT_FOUND);

  function handleRefresh() {
    void detail.refetch(KEEP_IN_FLIGHT);
    void history.refetch(KEEP_IN_FLIGHT);
  }

  function renderContent() {
    if (isNotFound) {
      return (
        <EmptyState
          title="차량을 찾을 수 없습니다"
          description="아직 체크인하지 않았거나 잘못된 주소입니다"
          action={
            <Link to={ROUTES.dashboard} className={buttonClassName({ variant: 'secondary' })}>
              대시보드로
            </Link>
          }
        />
      );
    }
    const vehicle = detail.data;
    // 이미 받은 값이 있으면 그대로 두고, 새로고침이 실패했다는 것만 알린다
    const isRefreshFailed =
      (detail.isError && vehicle !== undefined) || (history.isError && history.data !== undefined);
    return (
      <>
        <VehicleBreadcrumb current={vehicleId} />
        {isRefreshFailed && (
          <Alert
            type="error"
            title="최신 정보를 불러오지 못했습니다. 이전에 받은 정보를 보여 줍니다."
            action={
              <Button variant="secondary" onClick={handleRefresh}>
                다시 시도
              </Button>
            }
          />
        )}
        {vehicle === undefined ? (
          <Card title="차량 정보">
            <QueryFallback
              isPending={detail.isPending}
              errorTitle="차량 정보를 불러오지 못했습니다"
              errorCode={errorCodeOf(detail.error)}
              onRetry={() => void detail.refetch(KEEP_IN_FLIGHT)}
            />
          </Card>
        ) : (
          <>
            <VehicleSummaryCard
              vehicle={vehicle}
              isRefreshing={detail.isFetching || history.isFetching}
              onRefresh={handleRefresh}
            />
            <div className="grid gap-6 lg:grid-cols-5">
              <LastUpdateCard lastUpdate={vehicle.lastUpdate} className="lg:col-span-3" />
              <VehicleLocationCard
                location={vehicle.location}
                assignedEdgeId={vehicle.assignedEdgeId}
                className="lg:col-span-2"
              />
            </div>
          </>
        )}
        {/* 같은 라우트에서 다른 차량으로 가면 이력 페이지를 1페이지로 되돌린다 */}
        <UpdateHistoryCard
          key={vehicleId}
          events={history.data}
          isPending={history.isPending}
          errorCode={errorCodeOf(history.error)}
          onRetry={() => void history.refetch(KEEP_IN_FLIGHT)}
        />
      </>
    );
  }

  return (
    <>
      <Topbar title="차량 상세" />
      <div className="flex flex-col gap-6 p-8">{renderContent()}</div>
    </>
  );
}
