import type { CdnEdgeStatus } from '@/shared/cdnEdge/cdnEdgeSchema';

const COLUMNS = ['캠페인', '성공', '실패'] as const;

type EdgeDownloadTableProps = {
  /** 표 이름. 화면 읽기 도구가 Edge 마다 표를 구분할 수 있게 Edge 이름을 넣는다 */
  label: string;
  downloads: CdnEdgeStatus['downloads'];
};

/** 이 Edge 에서 파일을 받은 차량의 캠페인별 업데이트 성공·실패 수. 서버 순서(캠페인 번호 오름차순) 그대로 */
export function EdgeDownloadTable({ label, downloads }: EdgeDownloadTableProps) {
  if (downloads.length === 0) {
    return (
      <p className="rounded-lg bg-subtle px-4 py-3 text-xs text-fg-muted">
        이 Edge에서 받은 다운로드 기록이 없습니다
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table aria-label={label} className="w-full text-left text-xs whitespace-nowrap">
        <thead className="bg-subtle text-fg-muted">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-surface font-mono text-fg">
          {downloads.map((download) => (
            <tr key={download.campaignId}>
              <td className="px-4 py-4">#{download.campaignId}</td>
              <td className="px-4 py-4">{download.succeeded}</td>
              <td className="px-4 py-4">{download.failed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
