import Link from 'next/link';
import type { Metadata } from 'next';
import { CATEGORIES } from '@/data/books';
import { loadBooksShift } from '@/lib/books';

export const metadata: Metadata = {
  title: 'Danh mục sách',
  description: 'Tra cứu danh mục sách của thư viện khoa CNTT theo chuyên mục và tên sách.',
};

interface BooksPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const asText = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
};

const renderClock = (): string =>
  new Date().toLocaleTimeString('vi-VN', { hour12: false });

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const q = asText(params.q);
  const category = asText(params.category);

  const books = await loadBooksShift({ category, q });

  return (
    <section className="stack">
      <h1>Danh mục sách</h1>

      <form className="form-row" method="get" action="/books">
        <div className="field">
          <label htmlFor="q">Tìm sách</label>
          <input id="q" name="q" type="search" defaultValue={q} />
        </div>
        <div className="field">
          <label htmlFor="category">Chuyên mục</label>
          <select id="category" name="category" defaultValue={category}>
            <option value="">Tất cả</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Lọc</button>
      </form>

      <p>
        Tìm thấy {books.length} sách
      </p>
      <p>Render lúc: {renderClock()}</p>

      {books.length === 0 ? (
        <p>Không tìm thấy sách nào.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Tên sách</th>
                <th scope="col">Tác giả</th>
                <th scope="col">Số bản</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    <Link href={`/books/${book.id}`}>{book.title}</Link>
                  </td>
                  <td>{book.author}</td>
                  <td>{book.copies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
