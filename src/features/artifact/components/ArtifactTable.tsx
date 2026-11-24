import { Link } from 'react-router';

import { routePaths } from '@/shared/config/routes';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import {
  TABLE_CELL as CELL,
  TABLE_HEAD_CELL as HEAD_CELL,
  TABLE_TEXT_CELL as TEXT_CELL,
} from '@/shared/ui/tableClassNames';

import type { Artifact } from '../api/artifactSchemas';
import { formatDate } from '../lib/formatDateTime';
import { formatFileSize } from '../lib/formatFileSize';
import { shortenSha256 } from '../lib/shortenSha256';

type ArtifactTableProps = {
  artifacts: readonly Artifact[];
};

export function ArtifactTable({ artifacts }: ArtifactTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse">
        <thead className="bg-subtle">
          <tr>
            <th scope="col" className={HEAD_CELL}>
              ID
            </th>
            <th scope="col" className={HEAD_CELL}>
              차종
            </th>
            <th scope="col" className={HEAD_CELL}>
              버전
            </th>
            <th scope="col" className={HEAD_CELL}>
              크기
            </th>
            <th scope="col" className={HEAD_CELL}>
              SHA-256
            </th>
            <th scope="col" className={HEAD_CELL}>
              서명 키
            </th>
            <th scope="col" className={HEAD_CELL}>
              저장 경로
            </th>
            <th scope="col" className={HEAD_CELL}>
              등록일
            </th>
            <th scope="col" className={HEAD_CELL}>
              <span className="sr-only">상세</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {artifacts.map((artifact) => (
            <tr key={artifact.artifactId} className="border-t border-line bg-surface">
              <td className={CELL}>{artifact.artifactId}</td>
              <td className={TEXT_CELL}>{artifact.model}</td>
              <td className={CELL}>{artifact.version}</td>
              <td className={CELL}>{formatFileSize(artifact.fileSize)}</td>
              <td className={CELL}>
                <span title={artifact.sha256}>{shortenSha256(artifact.sha256)}</span>
              </td>
              <td className={CELL}>{artifact.keyId}</td>
              <td className={CELL}>{artifact.path}</td>
              <td className={CELL}>{formatDate(artifact.createdAt)}</td>
              <td className="h-12 px-4">
                <Link
                  to={routePaths.artifactDetail(artifact.artifactId)}
                  aria-label={`${artifact.model} ${artifact.version} 상세`}
                  className={buttonClassName({ variant: 'ghost' })}
                >
                  상세
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
