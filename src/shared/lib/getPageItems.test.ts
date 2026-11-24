import { describe, expect, it } from 'vitest';

import { getPageItems, type PageItem } from './getPageItems';

function labels(items: PageItem[]): string[] {
  return items.map((item) => (item.type === 'page' ? String(item.page) : '…'));
}

describe('getPageItems', () => {
  it('7페이지 이하면 모두 보여 준다', () => {
    expect(labels(getPageItems(1, 7))).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    expect(labels(getPageItems(1, 1))).toEqual(['1']);
  });

  it('앞쪽 페이지면 1~5 와 마지막 페이지를 보여 준다', () => {
    expect(labels(getPageItems(4, 22))).toEqual(['1', '2', '3', '4', '5', '…', '22']);
  });

  it('뒤쪽 페이지면 첫 페이지와 마지막 5개를 보여 준다', () => {
    expect(labels(getPageItems(19, 22))).toEqual(['1', '…', '18', '19', '20', '21', '22']);
  });

  it('가운데 페이지면 양쪽을 생략한다', () => {
    expect(labels(getPageItems(10, 22))).toEqual(['1', '…', '9', '10', '11', '…', '22']);
  });
});
