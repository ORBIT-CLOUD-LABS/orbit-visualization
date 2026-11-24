import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router';

import { createQueryClient } from '@/app/queryClient';

/** 라우트를 path 에서 열고 Query 캐시와 함께 그린다. 이동·캐시를 확인할 수 있게 router 와 queryClient 를 돌려준다 */
export function renderRoutes(
  routes: RouteObject[],
  path: string,
  queryClient: QueryClient = createQueryClient(),
) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return { router, queryClient };
}
