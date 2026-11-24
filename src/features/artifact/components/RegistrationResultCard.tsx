import { Link } from 'react-router';

import { buttonClassName } from '@/shared/ui/buttonClassName';

import type { ArtifactRegistration } from '../api/artifactSchemas';
import { campaignNewPath } from '../lib/campaignNewPath';
import { formatFileSize } from '../lib/formatFileSize';
import { shortenSha256 } from '../lib/shortenSha256';
import { Card } from './Card';
import { KeyValue } from './KeyValue';

type RegistrationResultCardProps = {
  result: ArtifactRegistration;
};

export function RegistrationResultCard({ result }: RegistrationResultCardProps) {
  return (
    <div aria-live="polite">
      <Card title="등록 완료">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
          <KeyValue label="파일 ID">{result.artifactId}</KeyValue>
          <KeyValue label="크기">{formatFileSize(result.fileSize)}</KeyValue>
          <KeyValue label="서명 키">{result.keyId}</KeyValue>
          <KeyValue label="SHA-256">
            <span title={result.sha256}>{shortenSha256(result.sha256)}</span>
          </KeyValue>
          <KeyValue label="저장 경로" className="col-span-2">
            {result.path}
          </KeyValue>
        </dl>
        <Link to={campaignNewPath(result.artifactId)} className={buttonClassName()}>
          이 파일로 캠페인 등록
        </Link>
      </Card>
    </div>
  );
}
