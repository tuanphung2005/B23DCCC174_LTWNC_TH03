import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Đăng nhập',
};

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  const params = await searchParams;
  const rawCallbackUrl = params.callbackUrl;
  const callbackUrl =
    typeof rawCallbackUrl === 'string' && rawCallbackUrl.startsWith('/')
      ? rawCallbackUrl
      : '/loans';

  return (
    <section className="stack">
      <h1>Đăng nhập</h1>
      <LoginForm callbackUrl={callbackUrl} />
    </section>
  );
}
