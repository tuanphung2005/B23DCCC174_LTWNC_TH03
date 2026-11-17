export type Role = 'student' | 'admin';
export type Category =
  | 'Lập trình'
  | 'Mạng máy tính'
  | 'Cơ sở dữ liệu'
  | 'Toán rời rạc';
export type Term = 7 | 14 | 30; // số ngày được mượn
export type LoanStatus = 'pending' | 'approved' | 'rejected';

export interface Book {
  id: number;
  title: string;
  author: string;
  category: Category;
  copies: number; // tổng số bản của thư viện
}

export interface Loan {
  id: number;
  bookId: number;
  userEmail: string;
  pickupDate: string; // YYYY-MM-DD
  term: Term;
  quantity: number; // số quyển muốn mượn
  reason: string;
  status: LoanStatus;
}
