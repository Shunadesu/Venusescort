'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useSiteStore } from '@/store/useSiteStore';
import { useAuthStore } from '@/store/useAuthStore';

const links = [
  { href: '/muses', label: 'MUSES' },
  { href: '/disciplines', label: 'DISCIPLINES' },
  { href: '/manifesto', label: 'THE MANIFESTO' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { menuOpen, toggleMenu } = useSiteStore();
  const { token, user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === '/';
  const hasBg = !isHome || scrolled || menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasBg ? 'bg-noir/95 backdrop-blur-sm border-b border-noir-light' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link
          href="/"
          className="font-serif text-xs sm:text-sm tracking-[0.25em] font-light text-cream transition-colors duration-300 hover:text-cream-light"
        >
          VENUSESCORT
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[11px] tracking-[0.28em] uppercase transition-colors duration-300 text-cream/75 hover:text-cream ${
                pathname.startsWith(href) ? 'text-cream' : ''
              }`}
            >
              {label}
            </Link>
          ))}
          {token && user ? (
            <div className="flex items-center gap-5">
              <span className="text-[11px] tracking-[0.1em] text-cream/70">{user.name || user.email}</span>
              <button
                type="button"
                onClick={logout}
                className="text-[11px] tracking-[0.2em] uppercase text-cream/75 hover:text-cream transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase font-light bg-cream/5 text-cream border border-cream/40 hover:bg-cream/15 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase font-light bg-cream text-noir hover:bg-cream-light transition-all duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
        <button
          type="button"
          onClick={toggleMenu}
          className="md:hidden p-2 text-cream"
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-noir border-b border-noir-light py-4 px-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={toggleMenu}
              className={`block py-2.5 text-[11px] tracking-[0.28em] uppercase transition-colors ${
                pathname === href ? 'text-cream' : 'text-cream/70'
              }`}
            >
              {label}
            </Link>
          ))}
          {token && user ? (
            <div className="pt-2 border-t border-noir-light mt-2">
              <p className="py-2 text-cream/75 text-[11px] tracking-[0.1em]">{user.name || user.email}</p>
              <button
                type="button"
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="block py-2 text-[11px] tracking-[0.2em] uppercase text-cream/70"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-noir-light mt-2 flex gap-3">
              <Link href="/login" onClick={toggleMenu} className="px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase font-light bg-cream/5 text-cream border border-cream/40">
                Login
              </Link>
              <Link href="/register" onClick={toggleMenu} className="px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase font-light bg-cream text-noir">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
