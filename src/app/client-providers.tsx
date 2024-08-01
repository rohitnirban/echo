// src/app/client-providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import { MediaPlayerProvider } from "@/context/MediaPlayerContext";

const queryClient = new QueryClient();

export default function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <MediaPlayerProvider>
        {children}
      </MediaPlayerProvider>
    </QueryClientProvider>
  );
}
