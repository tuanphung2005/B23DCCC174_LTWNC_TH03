'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import TextButton from '@/components/TextButton';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          Thư viện khoa CNTT
        </Link>
        <nav className="site-nav" aria-label="Menu chính">
          <Link href="/">Trang chủ</Link>
          <Link href="/books">Sách</Link>

          {status === 'authenticated' && session?.user ? (
            <>
              <Link href="/loans">Sách đã mượn</Link>
              {session.user.role === 'admin' ? (
                <Link href="/admin">Quản trị</Link>
              ) : null}
              <TextButton onClick={() => signOut({ callbackUrl: '/' })}>
                Đăng xuất
              </TextButton>
            </>
          ) : status === 'unauthenticated' ? (
            <Link href="/login">Đăng nhập</Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
