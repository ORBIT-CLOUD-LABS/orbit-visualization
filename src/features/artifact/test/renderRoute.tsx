import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';

type RenderRouteOptions = {
  /** 라우터에 등록할 경로 패턴. 예: /artifacts/:artifactId */
  path: string;
  /** 처음 열 주소. 없으면 path */
  url?: string;
};

// 다른 화면으로 이동했는지 확인할 수 있게 주소를 글자로 보여 준다
function CurrentLocation() {
  const location = useLocation();
  return <p>이동한 주소 {`${location.pathname}${location.search}`}</p>;
}

/** 화면 하나를 라우터·Query 와 함께 그린다. 재시도는 끄고 다른 경로는 주소만 보여 준다 */
export function renderRoute(element: ReactElement, { path, url = path }: RenderRouteOptions) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const router = createMemoryRouter(
    [
      { path, element },
      { path: '*', element: <CurrentLocation /> },
    ],
    { initialEntries: [url] },
  );
  const result: RenderResult = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return { ...result, router, queryClient };
}
