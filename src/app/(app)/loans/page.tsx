import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoanForm from '@/components/LoanForm';
import ScrollIntoView from '@/components/ScrollIntoView';
import { loadBooksShift } from '@/lib/books';
import { formatDate, STATUS_LABEL, TERM_LABEL } from '@/lib/format';
import { listLoans, parseStatus } from '@/lib/loans';
import { cancelLoanAction, createLoanAction } from './actions';

export const metadata: Metadata = {
  title: 'Sách đã mượn',
  robots: { index: false },
};

interface LoansPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const asText = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? '') : (value ?? '');

export default async function LoansPage({ searchParams }: LoansPageProps) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login');
  }

  const params = await searchParams;
  const status = parseStatus(asText(params.status));
  const page = Number(asText(params.page));
  const requestedBookId = Number(asText(params.book));
  const isStudent = session.user.role === 'student';

  const books = isStudent ? await loadBooksShift() : [];
  const result = listLoans(
    { email: session.user.email, role: session.user.role },
    status,
    page,
  );
  const defaultBookId = books.some((book) => book.id === requestedBookId)
    ? requestedBookId
    : undefined;

  const pageHref = (target: number): string =>
    `/loans?status=${encodeURIComponent(status)}&page=${target}`;

  return (
    <section className="stack">
      <h1>Sách đã mượn</h1>
      <p>
        Xin chào, {session.user.name} ({session.user.role})
      </p>

      <form className="form-row" method="get" action="/loans">
        <div className="field">
          <label htmlFor="status">Trạng thái</label>
          <select id="status" name="status" defaultValue={status}>
            <option value="">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
        <button type="submit">Lọc</button>
      </form>

      {result.items.length === 0 ? (
        <p>Không có yêu cầu nào.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Tên sách</th>
                <th scope="col">Ngày lấy</th>
                <th scope="col">Thời hạn</th>
                <th scope="col">Số quyển</th>
                <th scope="col">Trạng thái</th>
                {isStudent ? <th scope="col">Thao tác</th> : null}
              </tr>
            </thead>
            <tbody>
              {result.items.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.bookTitle}</td>
                  <td>{formatDate(loan.pickupDate)}</td>
                  <td>{TERM_LABEL[loan.term]}</td>
                  <td>{loan.quantity} quyển</td>
                  <td>{STATUS_LABEL[loan.status]}</td>
                  {isStudent ? (
                    <td>
                      {loan.status === 'pending' ? (
                        <form action={cancelLoanAction.bind(null, loan.id)}>
                          <button type="submit" className="secondary">
                            Hủy
                          </button>
                        </form>
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pager">
        {result.page > 1 ? (
          <Link href={pageHref(result.page - 1)}>Trước</Link>
        ) : (
          <span className="disabled">Trước</span>
        )}
        <span>
          Trang {result.page}/{result.totalPages}
        </span>
        {result.page < result.totalPages ? (
          <Link href={pageHref(result.page + 1)}>Sau</Link>
        ) : (
          <span className="disabled">Sau</span>
        )}
      </div>

      {isStudent ? (
        <>
          <h2 id="loan-form">Gửi yêu cầu mượn</h2>
          {defaultBookId ? <ScrollIntoView targetId="loan-form" /> : null}
          <LoanForm
            books={books}
            defaultBookId={defaultBookId}
            action={createLoanAction}
          />
        </>
      ) : null}
    </section>
  );
}
