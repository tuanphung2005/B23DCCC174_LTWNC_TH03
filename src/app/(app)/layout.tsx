import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <section className="stack">
      <p>Khu vực thành viên</p>
      {children}
    </section>
  );
}
