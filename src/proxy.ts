import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';

export default auth((req) => {
  const session = req.auth;
  const { nextUrl } = req;

  if (!session?.user) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set(
      'callbackUrl',
      `${nextUrl.pathname}${nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  if (
    nextUrl.pathname.startsWith('/admin') &&
    !can(session.user.role, 'loan:review')
  ) {
    return NextResponse.redirect(new URL('/forbidden', nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/loans/:path*', '/admin/:path*'],
};
