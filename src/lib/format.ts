import type { LoanStatus, Term } from '@/types';

export const TERM_LABEL: Record<Term, string> = {
  7: '7 ngày',
  14: '14 ngày',
  30: '30 ngày',
};

export const STATUS_LABEL: Record<LoanStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

export const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
