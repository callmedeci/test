'use client';

import { ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from '@tanstack/react-query';

let browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      },
    },
  });
}

function getQueryClient() {
  if (isServer) return makeQueryClient();
  else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();

    return browserQueryClient;
  }
}

function ReactQueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default ReactQueryProvider;
