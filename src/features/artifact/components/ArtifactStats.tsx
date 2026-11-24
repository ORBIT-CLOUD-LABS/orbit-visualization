import { StatCard } from '@/shared/ui/StatCard';

import type { Artifact } from '../api/artifactSchemas';
import { formatFileSize } from '../lib/formatFileSize';

type ArtifactStatsProps = {
  artifacts: readonly Artifact[];
};

export function ArtifactStats({ artifacts }: ArtifactStatsProps) {
  const modelCount = new Set(artifacts.map(({ model }) => model)).size;
  const keyIds = [...new Set(artifacts.map(({ keyId }) => keyId))].join(', ');
  const totalBytes = artifacts.reduce((sum, { fileSize }) => sum + fileSize, 0);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="등록 파일" value={artifacts.length} />
      <StatCard label="차종" value={modelCount} />
      <StatCard label="서명 키" value={keyIds} />
      <StatCard label="총 용량" value={formatFileSize(totalBytes)} />
    </div>
  );
}
