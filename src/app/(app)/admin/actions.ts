'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { can } from '@/lib/permissions';
import type { LoanStatus } from '@/types';

export async function reviewLoan(
  id: number,
  status: Extract<LoanStatus, 'approved' | 'rejected'>,
): Promise<void> {
  const session = await auth();
  if (!can(session?.user?.role, 'loan:review')) {
    throw new Error('Không có quyền');
  }

  const loan = db.loans.find((item) => item.id === id);
  if (!loan || loan.status !== 'pending') {
    return;
  }

  loan.status = status;
  revalidatePath('/admin');
}
