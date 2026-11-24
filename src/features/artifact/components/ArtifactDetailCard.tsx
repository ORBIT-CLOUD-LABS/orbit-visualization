import { Link } from 'react-router';

import { Alert } from '@/shared/ui/Alert';
import { Badge } from '@/shared/ui/Badge';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import { KeyValue } from '@/shared/ui/KeyValue';

import type { Artifact } from '../api/artifactSchemas';
import { campaignNewPath } from '../lib/campaignNewPath';
import { formatDateTime } from '../lib/formatDateTime';
import { formatByteCount, formatFileSize } from '../lib/formatFileSize';
import { CopySha256Button } from './CopySha256Button';

type ArtifactDetailCardProps = {
  artifact: Artifact;
};

export function ArtifactDetailCard({ artifact }: ArtifactDetailCardProps) {
  return (
    <section
      aria-label="파일 정보"
      className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-fg">
            {artifact.model} {artifact.version}
          </h2>
          <span className="font-mono text-base text-fg-muted">#{artifact.artifactId}</span>
          <Badge tone="info">서명 키 {artifact.keyId}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <CopySha256Button sha256={artifact.sha256} />
          <Link to={campaignNewPath(artifact.artifactId)} className={buttonClassName()}>
            이 파일로 캠페인 등록
          </Link>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
        <KeyValue label="차종">{artifact.model}</KeyValue>
        <KeyValue label="버전">{artifact.version}</KeyValue>
        <KeyValue label="크기">
          {formatFileSize(artifact.fileSize)} ({formatByteCount(artifact.fileSize)})
        </KeyValue>
        <KeyValue label="등록 일시">{formatDateTime(artifact.createdAt)}</KeyValue>
        <KeyValue label="SHA-256" className="col-span-full">
          {artifact.sha256}
        </KeyValue>
        <KeyValue label="저장 경로" className="col-span-full">
          {artifact.path}
        </KeyValue>
      </dl>
      <Alert
        type="info"
        title="등록한 파일은 수정할 수 없습니다. 문제가 있으면 더 높은 버전으로 새 파일을 등록해 배포하세요"
      />
    </section>
  );
}
