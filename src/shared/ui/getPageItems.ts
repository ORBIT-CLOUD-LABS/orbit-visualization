export type PageItem = { type: 'page'; page: number } | { type: 'ellipsis'; key: 'start' | 'end' };

/** 번호를 모두 보여 주는 최대 페이지 수. 넘으면 처음·끝·현재 주변만 보여 주고 나머지는 생략한다 */
const MAX_VISIBLE = 7;

function range(from: number, to: number): PageItem[] {
  return Array.from({ length: to - from + 1 }, (_, index) => ({
    type: 'page',
    page: from + index,
  }));
}

/** 페이지 번호 버튼 목록. 항상 7칸 이하로 만든다 */
export function getPageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= MAX_VISIBLE) {
    return range(1, pageCount);
  }

  const first: PageItem = { type: 'page', page: 1 };
  const last: PageItem = { type: 'page', page: pageCount };

  if (page <= 4) {
    return [...range(1, 5), { type: 'ellipsis', key: 'end' }, last];
  }
  if (page >= pageCount - 3) {
    return [first, { type: 'ellipsis', key: 'start' }, ...range(pageCount - 4, pageCount)];
  }
  return [
    first,
    { type: 'ellipsis', key: 'start' },
    ...range(page - 1, page + 1),
    { type: 'ellipsis', key: 'end' },
    last,
  ];
}
