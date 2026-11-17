import { db } from '@/lib/db';
import { can } from '@/lib/permissions';
import type { Loan, LoanStatus, Role } from '@/types';
import type { LoanData } from '@/lib/loan-validate';

export interface Viewer {
  email: string;
  role: Role;
}

export interface LoanListItem extends Loan {
  bookTitle: string;
}

export interface LoanList {
  items: LoanListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export type SubmitResult = { ok: true; loan: Loan } | { ok: false; message: string };

export type CancelResult = 'ok' | 'not-found' | 'forbidden' | 'not-pending';

const PAGE_SIZE = 10;

export const parseStatus = (value: string): LoanStatus | '' => {
  if (value === 'pending' || value === 'approved' || value === 'rejected') {
    return value;
  }
  return '';
};

const titleOf = (bookId: number): string =>
  db.books.find((book) => book.id === bookId)?.title ?? `Sách #${bookId}`;

export const listLoans = (
  viewer: Viewer,
  status: string,
  page: number,
): LoanList => {
  const statusFilter = parseStatus(status);
  const visible = can(viewer.role, 'loan:view-all')
    ? db.loans
    : db.loans.filter((loan) => loan.userEmail === viewer.email);
  const rows = statusFilter
    ? visible.filter((loan) => loan.status === statusFilter)
    : visible;

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requested = Number.isFinite(page) ? Math.trunc(page) : 1;
  const currentPage = Math.min(Math.max(requested, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;

  const items = rows
    .slice(start, start + PAGE_SIZE)
    .map((loan) => ({ ...loan, bookTitle: titleOf(loan.bookId) }));

  return { items, total, page: currentPage, totalPages };
};

export const submitLoan = (email: string, data: LoanData): SubmitResult => {
  const book = db.books.find((item) => item.id === data.bookId);
  const takenCopies = db.loans
    .filter(
      (loan) =>
        loan.bookId === data.bookId &&
        loan.pickupDate === data.pickupDate &&
        loan.status !== 'rejected',
    )
    .reduce((sum, loan) => sum + loan.quantity, 0);

  if (!book || takenCopies + data.quantity > book.copies) {
    return { ok: false, message: 'Sách đã hết bản vào ngày này' };
  }

  const loan: Loan = {
    id: db.nextLoanId++,
    bookId: data.bookId,
    userEmail: email,
    pickupDate: data.pickupDate,
    term: data.term,
    quantity: data.quantity,
    reason: data.reason,
    status: 'pending',
  };
  db.loans.unshift(loan);

  return { ok: true, loan };
};

export const cancelLoan = (email: string, id: number): CancelResult => {
  const index = db.loans.findIndex((loan) => loan.id === id);
  if (index === -1) return 'not-found';

  const loan = db.loans[index];
  if (loan.userEmail !== email) return 'forbidden';
  if (loan.status !== 'pending') return 'not-pending';

  db.loans.splice(index, 1);
  return 'ok';
};
