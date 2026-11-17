import type { Metadata } from 'next';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Sách đã mượn',
  robots: { index: false },
};

export default async function LoansPage() {
  const session = await auth();

  return (
    <section className="stack">
      <h1>Sách đã mượn</h1>
      {session?.user ? (
        <p>
          Xin chào, {session.user.name} ({session.user.role})
        </p>
      ) : null}
    </section>
  );
}
