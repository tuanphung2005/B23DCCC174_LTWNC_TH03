'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export default function SessionWatcher() {
  const { update } = useSession();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const cameFromLogin = previousPathname.current === '/login';
    previousPathname.current = pathname;

    if (cameFromLogin && pathname !== '/login') {
      void update();
    }
  }, [pathname, update]);

  return null;
}
