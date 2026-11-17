import type { Book, Term } from '@/types';

export interface LoanInput {
  bookId: string;
  pickupDate: string;
  term: string;
  quantity: string;
  reason: string;
}

export interface LoanData {
  bookId: number;
  pickupDate: string;
  term: 7 | 14 | 30;
  quantity: number;
  reason: string;
}

export type LoanErrors = Partial<Record<keyof LoanInput, string>>;

export interface LoanFormState {
  errors: LoanErrors;
  values: Partial<LoanInput>;
  message?: string;
  ok?: boolean;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const today = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

const readField = (
  raw: FormData | Record<string, unknown>,
  key: keyof LoanInput,
): string => {
  const value = raw instanceof FormData ? raw.get(key) : raw[key];
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return String(value);
};

export const toLoanInput = (
  raw: FormData | Record<string, unknown>,
): LoanInput => ({
  bookId: readField(raw, 'bookId'),
  pickupDate: readField(raw, 'pickupDate'),
  term: readField(raw, 'term'),
  quantity: readField(raw, 'quantity'),
  reason: readField(raw, 'reason'),
});

export const validateLoan = (input: LoanInput, books: Book[]): LoanErrors => {
  const errors: LoanErrors = {};

  const book = books.find((item) => String(item.id) === input.bookId.trim());
  if (!book) {
    errors.bookId = 'Hãy chọn sách';
  }

  const pickupDate = input.pickupDate.trim();
  if (!DATE_PATTERN.test(pickupDate)) {
    errors.pickupDate = 'Hãy chọn ngày';
  } else if (pickupDate < today()) {
    errors.pickupDate = 'Ngày lấy sách không được ở quá khứ';
  }

  const term = Number(input.term);
  if (term !== 7 && term !== 14 && term !== 30) {
    errors.term = 'Hãy chọn thời hạn';
  }

  const quantity = Number(input.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) {
    errors.quantity = 'Số quyển phải từ 1 trở lên';
  } else if (book && quantity > book.copies) {
    errors.quantity = `Vượt số bản của sách (${book.copies} bản)`;
  }

  if (input.reason.trim().length < 10) {
    errors.reason = 'Lý do tối thiểu 10 ký tự';
  }

  return errors;
};

export const toLoanData = (input: LoanInput): LoanData => ({
  bookId: Number(input.bookId),
  pickupDate: input.pickupDate.trim(),
  term: Number(input.term) as Term,
  quantity: Number(input.quantity),
  reason: input.reason.trim(),
});
