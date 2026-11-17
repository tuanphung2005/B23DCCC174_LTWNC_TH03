import { describe, expect, it } from 'vitest';
import { cancelLoan, listLoans, submitLoan } from '@/lib/loans';

const sv01 = { email: 'sv01@ptit.edu.vn', role: 'student' as const };
const admin = { email: 'admin@ptit.edu.vn', role: 'admin' as const };

const loanData = {
  bookId: 11,
  pickupDate: '2026-12-03',
  term: 14 as const,
  quantity: 1,
  reason: 'Mượn để làm đồ án môn cơ sở dữ liệu',
};

describe('listLoans', () => {
  it('sinh viên chỉ thấy yêu cầu của mình, chia 3 trang 10/10/7', () => {
    const first = listLoans(sv01, '', 1);
    expect(first.total).toBe(27);
    expect(first.totalPages).toBe(3);
    expect(first.items).toHaveLength(10);

    expect(listLoans(sv01, '', 2).items).toHaveLength(10);
    const third = listLoans(sv01, '', 3);
    expect(third.items).toHaveLength(7);
    expect(third.page).toBe(3);

    expect(first.items.every((loan) => loan.userEmail === sv01.email)).toBe(
      true,
    );
    expect(first.items[0].bookTitle).toBeTruthy();
  });

  it('quản trị thấy tất cả yêu cầu', () => {
    const result = listLoans(admin, '', 1);
    expect(result.total).toBe(37);
    expect(result.totalPages).toBe(4);
  });

  it('trang vượt giới hạn bị kẹp lại vào khoảng hợp lệ', () => {
    expect(listLoans(sv01, '', 99).page).toBe(3);
    expect(listLoans(sv01, '', 0).page).toBe(1);
    expect(listLoans(sv01, '', -5).page).toBe(1);
  });

  it('lọc theo trạng thái, giá trị lạ thì bỏ qua bộ lọc', () => {
    expect(listLoans(sv01, 'pending', 1).total).toBe(9);
    expect(listLoans(sv01, 'pending', 1).totalPages).toBe(1);
    expect(listLoans(admin, 'pending', 1).total).toBe(13);
    expect(listLoans(sv01, 'khong-hop-le', 1).total).toBe(27);
  });
});

describe('submitLoan', () => {
  it('báo hết bản khi vượt số bản vào ngày lấy sách', () => {
    const result = submitLoan('sv01@ptit.edu.vn', {
      bookId: 6,
      pickupDate: '2026-12-02',
      term: 14,
      quantity: 1,
      reason: 'Mượn để học an toàn thông tin',
    });

    expect(result).toEqual({ ok: false, message: 'Sách đã hết bản vào ngày này' });
  });

  it('tạo yêu cầu mới ở trạng thái chờ duyệt', () => {
    const result = submitLoan('sv01@ptit.edu.vn', loanData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.loan.status).toBe('pending');
      expect(result.loan.userEmail).toBe('sv01@ptit.edu.vn');
      expect(result.loan.bookId).toBe(11);
    }
  });
});

describe('cancelLoan', () => {
  it('trả forbidden, ok, not-found theo đúng thứ tự', () => {
    const created = submitLoan('sv01@ptit.edu.vn', {
      ...loanData,
      pickupDate: '2026-12-04',
    });
    if (!created.ok) throw new Error('không tạo được yêu cầu');

    expect(cancelLoan('sv02@ptit.edu.vn', created.loan.id)).toBe('forbidden');
    expect(cancelLoan('sv01@ptit.edu.vn', created.loan.id)).toBe('ok');
    expect(cancelLoan('sv01@ptit.edu.vn', created.loan.id)).toBe('not-found');
  });

  it('không hủy được yêu cầu đã duyệt', () => {
    expect(cancelLoan('sv01@ptit.edu.vn', 2)).toBe('not-pending');
    expect(cancelLoan('sv01@ptit.edu.vn', 99999)).toBe('not-found');
  });
});
