import Link from 'next/link';
import type { ReactNode } from 'react';

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
}

export default function ButtonLink({ href, children }: ButtonLinkProps) {
  return (
    <Link href={href} className="button">
      {children}
    </Link>
  );
}
