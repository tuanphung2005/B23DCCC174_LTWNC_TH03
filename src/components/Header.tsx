import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          Thư viện khoa CNTT
        </Link>
        <nav className="site-nav" aria-label="Menu chính">
          <Link href="/">Trang chủ</Link>
          <Link href="/books">Sách</Link>
        </nav>
      </div>
    </header>
  );
}
