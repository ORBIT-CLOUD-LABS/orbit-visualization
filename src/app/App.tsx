import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { createQueryClient } from './queryClient';
import { appRoutes } from './router/appRoutes';
import { redirectOnUnauthorized } from './router/redirectOnUnauthorized';

const queryClient = createQueryClient();
const router = createBrowserRouter(appRoutes);

export function App() {
  useEffect(() => redirectOnUnauthorized(router, queryClient), []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
