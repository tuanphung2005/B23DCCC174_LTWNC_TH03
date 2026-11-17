import Link from 'next/link';

export default function BookNotFound() {
  return (
    <section className="stack">
      <h1>Không tìm thấy sách</h1>
      <p>Sách bạn tìm không có trong thư viện.</p>
      <p>
        <Link href="/books">← Về danh mục sách</Link>
      </p>
    </section>
  );
}
