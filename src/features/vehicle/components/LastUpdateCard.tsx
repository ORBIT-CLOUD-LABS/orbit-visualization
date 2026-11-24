import { cn } from '@/shared/lib/cn';
import { Alert } from '@/shared/ui/Alert';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';

import type { VehicleLastUpdate } from '../api/vehicleSchemas';
import { failureReasonLabel } from '../lib/failureReasonLabel';
import { formatTimestamp } from '../lib/formatTimestamp';

import { KeyValue } from './KeyValue';

type LastUpdateCardProps = {
  /** 결과가 없으면 null */
  lastUpdate: VehicleLastUpdate | null;
  className?: string;
};

function failureCode({ failureReason, failureDetail }: VehicleLastUpdate): string | undefined {
  const parts = [failureReason, failureDetail].filter((part) => part !== null);
  return parts.length === 0 ? undefined : parts.join(' · ');
}

/** 마지막 업데이트 결과. 실패면 사유를 맨 위에 알린다 */
export function LastUpdateCard({ lastUpdate, className }: LastUpdateCardProps) {
  return (
    <Card title="마지막 업데이트 결과" className={cn('p-6', className)}>
      {lastUpdate === null ? (
        <EmptyState
          title="업데이트 결과가 없습니다"
          description="이 차량은 아직 업데이트 결과를 보고하지 않았습니다"
        />
      ) : (
        <>
          {lastUpdate.result === 'FAILED' && (
            <Alert
              type="error"
              title={failureReasonLabel(lastUpdate.failureReason)}
              code={failureCode(lastUpdate)}
            />
          )}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <KeyValue label="캠페인">#{lastUpdate.campaignId}</KeyValue>
            <KeyValue label="결과">{lastUpdate.result}</KeyValue>
            <KeyValue label="실패 사유">{lastUpdate.failureReason}</KeyValue>
            <KeyValue label="실패 상세">{lastUpdate.failureDetail}</KeyValue>
            <KeyValue label="다운로드 Edge">{lastUpdate.edgeId}</KeyValue>
            <KeyValue label="완료 시각">{formatTimestamp(lastUpdate.finishedAt)}</KeyValue>
          </dl>
        </>
      )}
    </Card>
  );
}
