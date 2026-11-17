import { db } from '@/lib/db';
import type { Book } from '@/types';

export interface BooksFilter {
  category?: string;
  q?: string;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Lấy danh sách sách, có thể lọc theo chuyên mục và tên sách.
 * Chờ 800ms để giả lập truy vấn chậm của cơ sở dữ liệu.
 */
export const loadBooksShift = async (filter: BooksFilter = {}): Promise<Book[]> => {
  await wait(800);
  const category = filter.category?.trim() ?? '';
  const q = filter.q?.trim().toLowerCase() ?? '';

  return db.books.filter((book) => {
    if (category && book.category !== category) return false;
    if (q && !book.title.toLowerCase().includes(q)) return false;
    return true;
  });
};

/** Lấy một sách theo id, không có thì trả undefined. */
export const loadBookById = async (id: number): Promise<Book | undefined> => {
  return db.books.find((book) => book.id === id);
};
