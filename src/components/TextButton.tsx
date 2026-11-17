'use client';

import type { ReactNode } from 'react';

interface TextButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function TextButton({ children, onClick }: TextButtonProps) {
  return (
    <button type="button" className="link-button" onClick={onClick}>
      {children}
    </button>
  );
}
