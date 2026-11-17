'use client';

import { useActionState } from 'react';
import { TERMS } from '@/data/books';
import { TERM_LABEL } from '@/lib/format';
import type { LoanFormState } from '@/lib/loan-validate';
import type { Book } from '@/types';

interface LoanFormProps {
  books: Book[];
  defaultBookId?: number;
  action: (
    prevState: LoanFormState,
    formData: FormData,
  ) => Promise<LoanFormState>;
}

const initialState: LoanFormState = { errors: {}, values: {} };

export default function LoanForm({
  books,
  defaultBookId,
  action,
}: LoanFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = state.values;
  const fallbackBookId = defaultBookId ? String(defaultBookId) : '';
  const bookValue = values.bookId ?? (state.ok ? '' : fallbackBookId);

  return (
    <form
      key={`${state.ok ? 'ok' : 'edit'}-${JSON.stringify(values)}`}
      action={formAction}
      className="loan-form"
    >
      <div className="field">
        <label htmlFor="bookId">Sách</label>
        <select id="bookId" name="bookId" defaultValue={bookValue}>
          <option value="">-- Chọn sách --</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} ({book.copies} bản)
            </option>
          ))}
        </select>
        {state.errors.bookId ? (
          <p className="field-error" role="alert">
            {state.errors.bookId}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="pickupDate">Ngày lấy sách</label>
        <input
          id="pickupDate"
          name="pickupDate"
          type="date"
          defaultValue={values.pickupDate ?? ''}
        />
        {state.errors.pickupDate ? (
          <p className="field-error" role="alert">
            {state.errors.pickupDate}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="term">Thời hạn mượn</label>
        <select id="term" name="term" defaultValue={values.term ?? ''}>
          <option value="">-- Chọn thời hạn --</option>
          {TERMS.map((term) => (
            <option key={term} value={term}>
              {TERM_LABEL[term]}
            </option>
          ))}
        </select>
        {state.errors.term ? (
          <p className="field-error" role="alert">
            {state.errors.term}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="quantity">Số quyển</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          defaultValue={values.quantity ?? '1'}
        />
        {state.errors.quantity ? (
          <p className="field-error" role="alert">
            {state.errors.quantity}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="reason">Lý do mượn</label>
        <textarea
          id="reason"
          name="reason"
          defaultValue={values.reason ?? ''}
        />
        {state.errors.reason ? (
          <p className="field-error" role="alert">
            {state.errors.reason}
          </p>
        ) : null}
      </div>

      <p>
        <button type="submit" disabled={pending}>
          Gửi yêu cầu
        </button>
      </p>

      {state.message ? (
        <p className={state.ok ? undefined : 'field-error'} role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
