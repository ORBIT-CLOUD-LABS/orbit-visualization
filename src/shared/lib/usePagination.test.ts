import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { usePagination } from './usePagination';

function numbers(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index + 1);
}

describe('usePagination', () => {
  it('기본 20개씩 나눈다', () => {
    const { result } = renderHook(() => usePagination(numbers(45)));

    expect(result.current.page).toBe(1);
    expect(result.current.pageCount).toBe(3);
    expect(result.current.pageItems).toEqual(numbers(20));
    expect(result.current.rangeStart).toBe(1);
    expect(result.current.rangeEnd).toBe(20);
  });

  it('페이지를 옮기면 그 페이지 항목을 돌려준다', () => {
    const { result } = renderHook(() => usePagination(numbers(45)));

    act(() => result.current.setPage(3));

    expect(result.current.page).toBe(3);
    expect(result.current.pageItems).toEqual([41, 42, 43, 44, 45]);
    expect(result.current.rangeStart).toBe(41);
    expect(result.current.rangeEnd).toBe(45);
  });

  it('범위 밖 페이지는 처음·마지막 페이지로 맞춘다', () => {
    const { result } = renderHook(() => usePagination(numbers(45)));

    act(() => result.current.setPage(10));
    expect(result.current.page).toBe(3);

    act(() => result.current.setPage(0));
    expect(result.current.page).toBe(1);
  });

  it('resetDeps 가 바뀌면 1페이지로 돌아간다', () => {
    const { result, rerender } = renderHook(
      ({ filter }) => usePagination(numbers(45), { resetDeps: [filter] }),
      { initialProps: { filter: 'ALL' } },
    );
    act(() => result.current.setPage(2));

    rerender({ filter: 'FAILED' });

    expect(result.current.page).toBe(1);
  });

  it('항목만 바뀌면 페이지를 유지하고, 줄어들면 마지막 페이지로 맞춘다', () => {
    const { result, rerender } = renderHook(({ items }) => usePagination(items), {
      initialProps: { items: numbers(45) },
    });
    act(() => result.current.setPage(3));

    rerender({ items: numbers(46) });
    expect(result.current.page).toBe(3);

    rerender({ items: numbers(30) });
    expect(result.current.page).toBe(2);
    expect(result.current.pageItems).toEqual(numbers(30).slice(20));
  });

  it('항목이 없으면 1 / 1 페이지에 범위는 0 이다', () => {
    const { result } = renderHook(() => usePagination([], { pageSize: 10 }));

    expect(result.current.page).toBe(1);
    expect(result.current.pageCount).toBe(1);
    expect(result.current.pageItems).toEqual([]);
    expect(result.current.rangeStart).toBe(0);
    expect(result.current.rangeEnd).toBe(0);
  });
});
