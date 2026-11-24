import { Link, useParams } from 'react-router';

import { ApiError } from '@/shared/api/ApiError';
import { ROUTES } from '@/shared/config/routes';
import { buttonClassName } from '@/shared/ui/buttonClassName';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Topbar } from '@/shared/ui/Topbar';

import { useArtifact } from '../hooks/useArtifact';
import { parseArtifactId } from '../lib/parseArtifactId';
import { ArtifactCampaignsCard } from './ArtifactCampaignsCard';
import { ArtifactDetailCard } from './ArtifactDetailCard';
import { Breadcrumb } from './Breadcrumb';
import { Card } from './Card';
import { LoadErrorAlert } from './LoadErrorAlert';
import { LoadingRows } from './LoadingRows';

const NOT_FOUND = 404;

/** 10 파일 상세 */
export function ArtifactDetailPage() {
  const params = useParams();
  const artifactId = parseArtifactId(params.artifactId);
  const { data: artifact, error, isPending, refetch } = useArtifact(artifactId);
  const isNotFound =
    artifactId === null || (error instanceof ApiError && error.status === NOT_FOUND);

  function renderContent() {
    if (isNotFound) {
      return (
        <EmptyState
          title="파일을 찾을 수 없습니다"
          description="삭제됐거나 잘못된 주소입니다"
          action={
            <Link to={ROUTES.artifacts} className={buttonClassName({ variant: 'secondary' })}>
              파일 목록으로
            </Link>
          }
        />
      );
    }
    if (artifact !== undefined) {
      return (
        <>
          <Breadcrumb current={`#${artifact.artifactId} ${artifact.model} ${artifact.version}`} />
          <ArtifactDetailCard artifact={artifact} />
          <ArtifactCampaignsCard model={artifact.model} version={artifact.version} />
        </>
      );
    }
    return (
      <>
        <Breadcrumb current="파일 상세" />
        <Card title="파일 정보">
          {isPending ? <LoadingRows /> : <LoadErrorAlert onRetry={() => void refetch()} />}
        </Card>
      </>
    );
  }

  return (
    <>
      <Topbar title="파일 상세" />
      <div className="flex flex-col gap-6 p-8">{renderContent()}</div>
    </>
  );
}
