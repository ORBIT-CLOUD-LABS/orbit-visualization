import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Topbar } from '@/shared/ui/Topbar';

import { useArtifacts } from '../hooks/useArtifacts';
import { ArtifactListCard } from './ArtifactListCard';
import { ArtifactStats } from './ArtifactStats';
import { QueryFallback } from './QueryFallback';
import { RegisterArtifactLink } from './RegisterArtifactLink';

const LIST_TITLE = '파일 목록';
const LIST_DESCRIPTION = '등록한 파일은 수정할 수 없습니다. 새 버전은 새 파일로 등록하세요';

/** 08 파일 목록 */
export function ArtifactListPage() {
  const { data: artifacts, isPending, refetch } = useArtifacts();

  function renderContent() {
    if (artifacts !== undefined && artifacts.length > 0) {
      return (
        <>
          <ArtifactStats artifacts={artifacts} />
          <ArtifactListCard artifacts={artifacts} />
        </>
      );
    }
    if (artifacts !== undefined) {
      return (
        <Card title={LIST_TITLE} description={LIST_DESCRIPTION}>
          <EmptyState
            title="등록된 파일이 없습니다"
            description="배포할 업데이트 파일을 먼저 등록하세요"
            action={<RegisterArtifactLink>파일 등록</RegisterArtifactLink>}
          />
        </Card>
      );
    }
    return (
      <Card
        title={LIST_TITLE}
        description={LIST_DESCRIPTION}
        action={<RegisterArtifactLink>+ 파일 등록</RegisterArtifactLink>}
      >
        <QueryFallback isPending={isPending} onRetry={() => void refetch()} />
      </Card>
    );
  }

  return (
    <>
      <Topbar title="파일" />
      <div className="flex flex-col gap-6 p-8">{renderContent()}</div>
    </>
  );
}
