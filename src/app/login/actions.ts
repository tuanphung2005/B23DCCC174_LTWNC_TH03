'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const rawCallbackUrl = String(formData.get('callbackUrl') ?? '');
  const callbackUrl = rawCallbackUrl.startsWith('/') ? rawCallbackUrl : '/loans';

  try {
    await signIn('credentials', { email, password, redirectTo: callbackUrl });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email hoặc mật khẩu không đúng' };
    }
    throw error;
  }
}
