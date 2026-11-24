import type { Pagination } from './usePagination';

type PageRange = Pick<
  Pagination<unknown>,
  'page' | 'pageCount' | 'totalCount' | 'rangeStart' | 'rangeEnd'
>;

/** 목록 아래 페이지 요약. unit 은 세는 단위(대·건·개). 예: "45대 중 21–40 · 2 / 3 페이지" */
export function formatPageSummary(
  { page, pageCount, totalCount, rangeStart, rangeEnd }: PageRange,
  unit: string,
): string {
  return `${totalCount}${unit} 중 ${rangeStart}–${rangeEnd} · ${page} / ${pageCount} 페이지`;
}
