import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoanForm from '@/components/LoanForm';
import { generateBooks } from '@/data/books';
import type { LoanFormState } from '@/lib/loan-validate';

type LoanAction = (
  prevState: LoanFormState,
  formData: FormData,
) => Promise<LoanFormState>;

const books = generateBooks(24);

const createAction = (state: LoanFormState) =>
  vi.fn<LoanAction>().mockResolvedValue(state);

describe('LoanForm', () => {
  it('hiện lỗi ngay dưới đúng ô khi action trả errors', async () => {
    const action = createAction({
      errors: {
        bookId: 'Hãy chọn sách',
        quantity: 'Số quyển phải từ 1 trở lên',
      },
      values: {},
    });
    render(<LoanForm books={books} action={action} />);

    await userEvent.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));

    expect(await screen.findByText('Hãy chọn sách')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Sách').closest('.field'),
    ).toHaveTextContent('Hãy chọn sách');
    expect(
      screen.getByLabelText('Số quyển').closest('.field'),
    ).toHaveTextContent('Số quyển phải từ 1 trở lên');
  });

  it('điền hợp lệ thì action được gọi 1 lần với FormData đúng', async () => {
    const user = userEvent.setup();
    const action = createAction({
      errors: {},
      values: {},
      message: 'Đã gửi yêu cầu, chờ duyệt',
      ok: true,
    });
    render(<LoanForm books={books} action={action} />);

    await user.selectOptions(screen.getByLabelText('Sách'), '11');
    fireEvent.change(screen.getByLabelText('Ngày lấy sách'), {
      target: { value: '2026-12-03' },
    });
    await user.selectOptions(screen.getByLabelText('Thời hạn mượn'), '14');
    await user.click(screen.getByLabelText('Số quyển'));
    await user.keyboard('{Control>}a{/Control}1');
    await user.type(
      screen.getByLabelText('Lý do mượn'),
      'Mượn để làm đồ án môn cơ sở dữ liệu',
    );

    await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));

    const formData = action.mock.calls[0][1];
    expect(formData.get('bookId')).toBe('11');
    expect(formData.get('term')).toBe('14');
    expect(formData.get('quantity')).toBe('1');
    expect(formData.get('pickupDate')).toBe('2026-12-03');
  });

  it('hiện thông báo hết bản và giữ nguyên lý do đã nhập', async () => {
    const user = userEvent.setup();
    const action = createAction({
      errors: {},
      values: {
        bookId: '6',
        pickupDate: '2026-12-02',
        term: '14',
        quantity: '1',
        reason: 'Mượn để học an toàn thông tin',
      },
      message: 'Sách đã hết bản vào ngày này',
    });
    render(<LoanForm books={books} action={action} />);

    await user.type(
      screen.getByLabelText('Lý do mượn'),
      'Mượn để học an toàn thông tin',
    );
    await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));

    expect(
      await screen.findByText('Sách đã hết bản vào ngày này'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Lý do mượn')).toHaveValue(
      'Mượn để học an toàn thông tin',
    );
  });

  it('chọn sẵn sách theo defaultBookId', () => {
    const action = createAction({ errors: {}, values: {} });
    render(<LoanForm books={books} defaultBookId={6} action={action} />);

    expect(screen.getByLabelText('Sách')).toHaveValue('6');
  });
});
