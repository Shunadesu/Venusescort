'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi';

const links = [
  { href: '/', label: 'HOME' },
  { href: '/muses', label: 'MUSES' },
  { href: '/disciplines', label: 'DISCIPLINES' },
  { href: '/manifesto', label: 'THE MANIFESTO' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${api}/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        const data = await res.json();
        setStatus(data?.message || 'error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-noir text-cream mt-auto">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Top section — brand + nav */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-16 pb-14 border-b border-cream/10">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl tracking-[0.2em] font-light mb-4">
              VENUSESCORT
            </h3>
            <p className="text-cream/70 text-sm md:text-base max-w-sm leading-relaxed tracking-[0.02em]">
              A standards-based collective of untamed muses.
            </p>
          </div>
          <nav className="flex flex-col sm:flex-row sm:items-end sm:gap-10">
            <div className="flex flex-wrap gap-x-8 gap-y-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs uppercase tracking-[0.25em] text-cream/70 hover:text-cream transition-colors duration-300"
                >
                  {label}
                </Link>
              ))}
            </div>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.25em] text-cream/70 hover:text-cream transition-colors duration-300 mt-4 sm:mt-0"
            >
              Instagram
            </a>
          </nav>
        </div>

        {/* Newsletter */}
        <div className="pt-12 pb-14 border-b border-cream/10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-cream/50 mb-2">Notices</p>
          <p className="text-sm text-cream/60 mb-6 tracking-[0.02em]">
            Selective email updates. No noise.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="flex-1 px-4 py-3 bg-transparent border border-cream/20 rounded-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cream/50 transition-colors duration-300 text-sm tracking-wide"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-cream/30 text-cream text-xs uppercase tracking-[0.2em] hover:bg-cream/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? (
                '...'
              ) : (
                <>
                  Subscribe
                  <HiOutlineArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
          {status === 'success' && (
            <p className="text-sm text-cream/60 mt-3 tracking-wide">Thank you for subscribing.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-cream/50 mt-3">Something went wrong. Please try again.</p>
          )}
        </div>

        {/* Bottom — legal */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-[11px] uppercase tracking-[0.2em] text-cream/40">
            Terms & Conditions
          </span>
          <p className="text-[11px] text-cream/40 tracking-[0.05em]">
            © {new Date().getFullYear()} Venusescort. All rights reserved. Unauthorized use is prohibited.
          </p>
        </div>
      </div>
    </footer>
  );
}
