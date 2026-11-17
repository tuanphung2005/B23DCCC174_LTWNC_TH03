import { describe, expect, it } from 'vitest';
import { generateBooks } from '@/data/books';
import {
  toLoanData,
  toLoanInput,
  validateLoan,
  type LoanInput,
} from '@/lib/loan-validate';

const books = generateBooks(24);

const addDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const validInput: LoanInput = {
  bookId: '11',
  pickupDate: addDays(5),
  term: '14',
  quantity: '1',
  reason: 'Mượn để làm đồ án môn cơ sở dữ liệu',
};

describe('validateLoan', () => {
  it('dữ liệu hợp lệ trả object rỗng', () => {
    expect(validateLoan(validInput, books)).toEqual({});
  });

  it('form trống báo đủ lỗi', () => {
    const errors = validateLoan(toLoanInput(new FormData()), books);

    expect(errors.bookId).toBe('Hãy chọn sách');
    expect(errors.pickupDate).toBe('Hãy chọn ngày');
    expect(errors.term).toBe('Hãy chọn thời hạn');
    expect(errors.reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('báo lỗi khi ngày lấy sách ở quá khứ', () => {
    const errors = validateLoan({ ...validInput, pickupDate: '2020-01-01' }, books);

    expect(errors.pickupDate).toBe('Ngày lấy sách không được ở quá khứ');
  });

  it('báo lỗi khi lý do dưới 10 ký tự', () => {
    const errors = validateLoan({ ...validInput, reason: 'Mượn sách' }, books);

    expect(errors.reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('chuỗi toàn khoảng trắng cũng bị coi là lý do không hợp lệ', () => {
    const errors = validateLoan({ ...validInput, reason: '            ' }, books);

    expect(errors.reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('báo số quyển vượt số bản của sách', () => {
    const errors = validateLoan(
      { ...validInput, bookId: '1', quantity: '2' },
      books,
    );

    expect(errors.quantity).toBe('Vượt số bản của sách (1 bản)');
  });

  it('báo lỗi khi số quyển không phải số nguyên dương', () => {
    expect(
      validateLoan({ ...validInput, quantity: '1.5' }, books).quantity,
    ).toBe('Số quyển phải từ 1 trở lên');
    expect(validateLoan({ ...validInput, quantity: '0' }, books).quantity).toBe(
      'Số quyển phải từ 1 trở lên',
    );
  });

  it('báo lỗi khi thời hạn không hợp lệ', () => {
    const errors = validateLoan({ ...validInput, term: '10' }, books);

    expect(errors.term).toBe('Hãy chọn thời hạn');
  });
});

describe('toLoanInput', () => {
  it('đọc dữ liệu từ FormData và để trống trường thiếu', () => {
    const formData = new FormData();
    formData.set('bookId', '6');
    formData.set('pickupDate', '2026-12-02');
    formData.set('term', '14');
    formData.set('quantity', '1');

    expect(toLoanInput(formData)).toEqual({
      bookId: '6',
      pickupDate: '2026-12-02',
      term: '14',
      quantity: '1',
      reason: '',
    });
  });

  it('đọc dữ liệu từ object thường', () => {
    expect(toLoanInput({ bookId: 6, reason: null })).toEqual({
      bookId: '6',
      pickupDate: '',
      term: '',
      quantity: '',
      reason: '',
    });
  });
});

describe('toLoanData', () => {
  it('ép kiểu số và trim lý do', () => {
    expect(
      toLoanData({
        bookId: '11',
        pickupDate: '2026-12-03',
        term: '30',
        quantity: '2',
        reason: '  Mượn để học  ',
      }),
    ).toEqual({
      bookId: 11,
      pickupDate: '2026-12-03',
      term: 30,
      quantity: 2,
      reason: 'Mượn để học',
    });
  });
});
