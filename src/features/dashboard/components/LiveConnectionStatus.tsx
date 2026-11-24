import type { SseConnectionStatus } from '@/shared/api/sseClient';
import { formatClockTime } from '@/shared/lib/formatClockTime';
import { Badge, type BadgeTone } from '@/shared/ui/Badge';

const STATUS_BADGE: Record<SseConnectionStatus, { tone: BadgeTone; label: string }> = {
  connecting: { tone: 'pending', label: '연결 중' },
  connected: { tone: 'healthy', label: '실시간 연결됨' },
  reconnecting: { tone: 'pending', label: '재연결 중' },
  disconnected: { tone: 'unhealthy', label: '실시간 연결 끊김' },
};

type LiveConnectionStatusProps = {
  status: SseConnectionStatus;
  /** 마지막으로 데이터를 받은 시각(ms). 아직 받지 못했으면 null */
  lastUpdatedAt: number | null;
};

/** Topbar 오른쪽의 실시간 연결 배지와 마지막 갱신 시각 */
export function LiveConnectionStatus({ status, lastUpdatedAt }: LiveConnectionStatusProps) {
  const badge = STATUS_BADGE[status];
  const lastUpdated = formatClockTime(lastUpdatedAt);

  return (
    <>
      {/* output 은 status 역할이라 연결 상태가 바뀌면 화면 읽기 도구가 읽어 준다 */}
      <output>
        <Badge tone={badge.tone}>{badge.label}</Badge>
      </output>
      <p className="text-xs text-fg-muted">
        마지막 갱신 <span className="font-mono">{lastUpdated ?? '—'}</span>
      </p>
    </>
  );
}
