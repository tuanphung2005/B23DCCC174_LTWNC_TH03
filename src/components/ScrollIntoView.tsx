'use client';

import { useEffect } from 'react';

export default function ScrollIntoView({ targetId }: { targetId: string }) {
  useEffect(() => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [targetId]);

  return null;
}
