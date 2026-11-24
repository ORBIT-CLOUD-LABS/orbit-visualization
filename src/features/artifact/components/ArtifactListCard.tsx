import { useState } from 'react';

import { usePagination } from '@/shared/lib/usePagination';
import { Pagination } from '@/shared/ui/Pagination';

import type { Artifact } from '../api/artifactSchemas';
import { ArtifactTable } from './ArtifactTable';
import { Card } from './Card';
import { RegisterArtifactLink } from './RegisterArtifactLink';

/** 차종 필터에서 전체를 뜻하는 값 */
const ALL_MODELS = '';

type ArtifactListCardProps = {
  artifacts: readonly Artifact[];
};

export function ArtifactListCard({ artifacts }: ArtifactListCardProps) {
  const [selectedModel, setModel] = useState(ALL_MODELS);
  const models = [...new Set(artifacts.map((artifact) => artifact.model))].toSorted();
  // 다시 불러온 목록에 고른 차종이 없으면 전체로 본다
  const model = models.includes(selectedModel) ? selectedModel : ALL_MODELS;
  const filtered =
    model === ALL_MODELS ? artifacts : artifacts.filter((artifact) => artifact.model === model);
  const pagination = usePagination(filtered, { resetDeps: [model] });

  return (
    <Card
      title="파일 목록"
      description="등록한 파일은 수정할 수 없습니다. 새 버전은 새 파일로 등록하세요"
      action={
        <>
          <label className="flex h-9 items-center gap-1.5 rounded-md border border-line bg-surface px-3">
            <span className="text-xs text-fg-muted">차종</span>
            <select
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="bg-transparent text-sm font-medium text-fg"
            >
              <option value={ALL_MODELS}>전체</option>
              {models.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <RegisterArtifactLink>+ 파일 등록</RegisterArtifactLink>
        </>
      }
    >
      <ArtifactTable artifacts={pagination.pageItems} />
      <Pagination
        page={pagination.page}
        pageCount={pagination.pageCount}
        onPageChange={pagination.setPage}
        summary={`${pagination.totalCount}개 중 ${pagination.rangeStart}–${pagination.rangeEnd} · ${pagination.page} / ${pagination.pageCount} 페이지`}
      />
    </Card>
  );
}
