'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

const links = [
  { href: '/', label: 'Our Muses' },
  { href: '/disciplines', label: 'Disciplines' },
  { href: '/manifesto', label: 'The Manifesto' },
  { href: '/contact', label: 'Contact' },
];

const CONNECT_ICONS = [
  { key: 'instagramUrl', Icon: FaInstagram, label: 'Instagram' },
  { key: 'facebookUrl', Icon: FaFacebookF, label: 'Facebook' },
  { key: 'whatsappUrl', Icon: FaWhatsapp, label: 'WhatsApp' },
  { key: 'telegramUrl', Icon: FaTelegram, label: 'Telegram' },
  { key: 'emailUrl', Icon: HiOutlineMail, label: 'Email' },
];

function buildHref(key, value) {
  if (!value?.trim()) return null;
  if (key === 'emailUrl') {
    return value.startsWith('mailto:') ? value : `mailto:${value}`;
  }
  if (key === 'whatsappUrl') {
    if (value.startsWith('http')) return value;
    const v = value.replace(/\D/g, '');
    return v ? `https://wa.me/${v}` : null;
  }
  return value;
}

export default function Footer({ site }) {
  const brandName = site?.brandName || 'Venusescort';
  const slogan = site?.slogan || 'A standards-based collective of untamed muses.';
  const connectLinks = CONNECT_ICONS.filter(({ key }) => {
    const href = buildHref(key, site?.[key]);
    return !!href;
  });

  return (
    <footer className="relative bg-gradient-to-br from-noir via-[#14110f] to-noir text-cream mt-auto border-t border-cream/10 overflow-hidden">
      {/* Subtle horizontal glow line across the middle */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cream/25 to-transparent opacity-80" />

      <div className="relative max-w-[1600px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20">
        {/* Main columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 lg:gap-16 pb-10 border-b border-cream/15">
          {/* Brand + description + language */}
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl md:text-3xl tracking-[0.18em] font-light mb-3">
                {brandName}
              </h3>
              <p className="text-cream/70 text-sm md:text-base max-w-sm leading-relaxed tracking-[0.02em]">
                {slogan}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-cream/50 mb-2">
                Language
              </p>
              <div className="inline-flex items-center rounded-sm border border-cream/30 bg-noir px-3 py-2 text-xs tracking-[0.18em] uppercase">
                <span className="mr-3 text-cream/70">English</span>
                <span className="text-cream/40 text-[10px]">▼</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cream/50 mb-4">
              Quick Links
            </p>
            <ul className="space-y-2 text-sm text-cream/70">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-cream transition-colors duration-300 tracking-[0.04em]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cream/50 mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>
                <Link
                  href="/privacy-policy"
                  className="tracking-[0.04em] hover:text-cream transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="tracking-[0.04em] hover:text-cream transition-colors duration-300"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/imprint"
                  className="tracking-[0.04em] hover:text-cream transition-colors duration-300"
                >
                  Imprint
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cream/50 mb-4">Connect</p>
            {connectLinks.length > 0 ? (
              <div className="flex gap-3">
                {connectLinks.map(({ key, Icon, label }) => {
                  const href = buildHref(key, site?.[key]);
                  if (!href) return null;
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-cream/30 flex items-center justify-center text-cream/80 hover:text-cream hover:border-cream/50 transition-all duration-300"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-cream/50">Connect channels coming soon.</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 md:pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <p className="text-[11px] text-cream/45 tracking-[0.08em]">
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <p className="text-[11px] text-cream/45 tracking-[0.12em]">
            Crafted with elegance and exacting standards.
          </p>
        </div>
      </div>
    </footer>
  );
}
