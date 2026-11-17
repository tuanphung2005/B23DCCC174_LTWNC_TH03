import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Không có quyền truy cập',
};

export default function ForbiddenPage() {
  return (
    <section className="stack">
      <h1>Không có quyền truy cập</h1>
      <p>Bạn không có quyền truy cập trang này.</p>
      <p>
        <Link href="/">← Về trang chủ</Link>
      </p>
    </section>
  );
}
