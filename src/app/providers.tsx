'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import SessionWatcher from '@/components/SessionWatcher';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionWatcher />
      {children}
    </SessionProvider>
  );
}
