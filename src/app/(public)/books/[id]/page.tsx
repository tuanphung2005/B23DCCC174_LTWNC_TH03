import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ButtonLink from '@/components/ButtonLink';
import { db } from '@/lib/db';
import { loadBookById } from '@/lib/books';

export const revalidate = 60;

export const generateStaticParams = (): { id: string }[] =>
  db.books.slice(0, 12).map((book) => ({ id: String(book.id) }));

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: BookPageProps): Promise<Metadata> => {
  const { id } = await params;
  const book = await loadBookById(Number(id));

  if (!book) {
    return { title: 'Không tìm thấy sách' };
  }

  return {
    title: `${book.title} – ${book.author}`,
    description: `Sách ${book.category}, thư viện có ${book.copies} bản.`,
  };
};

export default async function BookDetailPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = await loadBookById(Number(id));

  if (!book) {
    notFound();
  }

  const updatedAt = new Date().toLocaleTimeString('vi-VN', { hour12: false });

  return (
    <article className="stack">
      <h1>{book.title}</h1>
      <p>Tác giả: {book.author}</p>
      <p>Chuyên mục: {book.category}</p>
      <p>Số bản: {book.copies}</p>
      <p>Cập nhật lúc: {updatedAt}</p>
      <p>
        <ButtonLink href={`/loans?book=${book.id}`}>Mượn sách này</ButtonLink>
      </p>
      <p>
        <Link href="/books">← Về danh mục sách</Link>
      </p>
    </article>
  );
}
