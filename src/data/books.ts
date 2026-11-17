import type { Book, Category, Loan, LoanStatus, Term } from '../types';

export const CATEGORIES: Category[] = [
  'Lập trình', 'Mạng máy tính', 'Cơ sở dữ liệu', 'Toán rời rạc',
];
export const TERMS: Term[] = [7, 14, 30];

const STATUSES: LoanStatus[] = ['pending', 'approved', 'rejected'];

const TITLES: Record<Category, string[]> = {
  'Lập trình': [
    'Lập trình C căn bản', 'Lập trình hướng đối tượng',
    'Cấu trúc dữ liệu và giải thuật', 'Lập trình web với JavaScript',
    'Kỹ thuật lập trình', 'Nhập môn TypeScript',
  ],
  'Mạng máy tính': [
    'Nhập môn mạng máy tính', 'An toàn mạng', 'Lập trình mạng',
    'Quản trị hệ thống mạng', 'Điện toán đám mây', 'Giao thức TCP/IP',
  ],
  'Cơ sở dữ liệu': [
    'Nhập môn cơ sở dữ liệu', 'SQL từ cơ bản đến nâng cao',
    'Thiết kế cơ sở dữ liệu', 'Cơ sở dữ liệu NoSQL',
    'Kho dữ liệu', 'Tối ưu truy vấn',
  ],
  'Toán rời rạc': [
    'Toán rời rạc', 'Lý thuyết đồ thị', 'Xác suất thống kê',
    'Đại số tuyến tính', 'Giải tích 1', 'Logic toán học',
  ],
};

const AUTHORS = [
  'Nguyễn Văn Hùng', 'Trần Minh Đức', 'Lê Thu Hà', 'Phạm Quang Huy',
  'Hoàng Mai Lan', 'Vũ Đình Khoa', 'Đặng Thanh Bình', 'Bùi Ngọc Anh',
];

export const generateBooks = (count: number): Book[] =>
  Array.from({ length: count }, (_, i) => {
    const category = CATEGORIES[i % 4];
    return {
      id: i + 1,
      title: TITLES[category][Math.floor(i / 4) % 6],
      author: AUTHORS[(i * 3) % 8],
      category,
      copies: 1 + ((i * 3 + Math.floor(i / 4)) % 4), // từ 1 đến 4 bản
    };
  });

export const generateLoans = (count: number): Loan[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    bookId: ((i * 5) % 24) + 1,
    userEmail: i % 4 === 0 ? 'sv02@ptit.edu.vn' : 'sv01@ptit.edu.vn',
    pickupDate: `2026-12-${String(1 + (i % 28)).padStart(2, '0')}`,
    term: TERMS[i % 3],
    quantity: 1,
    reason: `Mượn phục vụ môn học, đợt ${i + 1}`,
    status: STATUSES[i % 3],
  }));
