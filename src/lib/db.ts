import { generateBooks, generateLoans } from '../data/books';
import type { Book, Loan } from '../types';

interface Db {
  books: Book[];
  loans: Loan[];
  nextLoanId: number;
}

const g = globalThis as unknown as { __libDb?: Db };

// Một bản dữ liệu duy nhất trong bộ nhớ, không mất khi Next.js hot reload.
export const db: Db = (g.__libDb ??= {
  books: generateBooks(24),
  loans: generateLoans(37),
  nextLoanId: 38,
});
