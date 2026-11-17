import Link from 'next/link';

export default function BookNotFound() {
  return (
    <section className="stack">
      <h1>Không tìm thấy sách</h1>
      <p>
        <Link href="/books">← Về danh mục sách</Link>
      </p>
    </section>
  );
}
