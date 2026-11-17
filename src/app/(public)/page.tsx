import Link from 'next/link';
import { loadBooksShift } from '@/lib/books';

export default async function HomePage() {
  const books = await loadBooksShift();
  const categoryCount = new Set(books.map((book) => book.category)).size;

  return (
    <section className="stack">
      <h1>Thư viện khoa CNTT PTIT</h1>
      <p>
        {books.length} đầu sách · {categoryCount} chuyên mục
      </p>
      <p>
        <Link href="/books">Xem danh mục sách</Link>
      </p>
    </section>
  );
}
