import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { can } from '@/lib/permissions';
import { formatDate, TERM_LABEL } from '@/lib/format';
import { reviewLoan } from './actions';

export const metadata: Metadata = {
  title: 'Quản trị',
  robots: { index: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!can(session?.user?.role, 'loan:review')) {
    redirect('/forbidden');
  }

  const pending = db.loans.filter((loan) => loan.status === 'pending');
  const approvedCount = db.loans.filter(
    (loan) => loan.status === 'approved',
  ).length;
  const rejectedCount = db.loans.filter(
    (loan) => loan.status === 'rejected',
  ).length;

  const titleOf = (bookId: number): string =>
    db.books.find((book) => book.id === bookId)?.title ?? `Sách #${bookId}`;

  return (
    <section className="stack">
      <h1>Duyệt yêu cầu mượn</h1>
      <p>
        Chờ duyệt: {pending.length} | Đã duyệt: {approvedCount} | Từ chối:{' '}
        {rejectedCount}
      </p>

      {pending.length === 0 ? (
        <p>Không có yêu cầu nào chờ duyệt.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Tên sách</th>
                <th scope="col">Ngày lấy</th>
                <th scope="col">Thời hạn</th>
                <th scope="col">Người mượn</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((loan) => (
                <tr key={loan.id}>
                  <td>{titleOf(loan.bookId)}</td>
                  <td>{formatDate(loan.pickupDate)}</td>
                  <td>{TERM_LABEL[loan.term]}</td>
                  <td>{loan.userEmail}</td>
                  <td>
                    <div className="actions">
                      <form action={reviewLoan.bind(null, loan.id, 'approved')}>
                        <button type="submit">Duyệt</button>
                      </form>
                      <form action={reviewLoan.bind(null, loan.id, 'rejected')}>
                        <button type="submit" className="secondary">
                          Từ chối
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
