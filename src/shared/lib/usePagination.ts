import { useState } from 'react';

export const DEFAULT_PAGE_SIZE = 20;

type UsePaginationOptions = {
  pageSize?: number;
  /** 값 중 하나라도 바뀌면 1페이지로 돌아간다. 필터·검색어를 넣는다 */
  resetDeps?: readonly unknown[];
};

export type Pagination<T> = {
  /** 1부터 센다 */
  page: number;
  pageCount: number;
  pageItems: readonly T[];
  totalCount: number;
  /** 지금 페이지 첫 항목의 순번(1부터). 항목이 없으면 0 */
  rangeStart: number;
  /** 지금 페이지 마지막 항목의 순번. 항목이 없으면 0 */
  rangeEnd: number;
  setPage: (page: number) => void;
};

function isSameDeps(a: readonly unknown[], b: readonly unknown[]): boolean {
  return a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
}

/**
 * 받은 목록을 브라우저에서 페이지로 나눈다.
 * 항목 수가 줄어 지금 페이지가 없어지면 마지막 페이지를 보여 준다.
 * 실시간 갱신으로 항목만 바뀔 때는 페이지를 유지하고, resetDeps 가 바뀔 때만 1페이지로 돌아간다.
 */
export function usePagination<T>(
  items: readonly T[],
  { pageSize = DEFAULT_PAGE_SIZE, resetDeps = [] }: UsePaginationOptions = {},
): Pagination<T> {
  const [requestedPage, setRequestedPage] = useState(1);
  const [prevResetDeps, setPrevResetDeps] = useState(resetDeps);

  // 렌더링 중에 이전 값과 비교해 바로 맞춘다 (react.dev "Adjusting some state when a prop changes")
  if (!isSameDeps(prevResetDeps, resetDeps)) {
    setPrevResetDeps(resetDeps);
    setRequestedPage(1);
  }

  const totalCount = items.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const page = Math.min(Math.max(requestedPage, 1), pageCount);
  const offset = (page - 1) * pageSize;
  const pageItems = items.slice(offset, offset + pageSize);

  function setPage(next: number): void {
    setRequestedPage(Math.min(Math.max(Math.trunc(next), 1), pageCount));
  }

  return {
    page,
    pageCount,
    pageItems,
    totalCount,
    rangeStart: totalCount === 0 ? 0 : offset + 1,
    rangeEnd: offset + pageItems.length,
    setPage,
  };
}
