'use client';

import { useState } from 'react';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaTelegram, FaShareAlt, FaTimes } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

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

export default function FloatingConnect({ site }) {
  const [open, setOpen] = useState(false);

  const links = CONNECT_ICONS.map(({ key, Icon, label }) => {
    const href = buildHref(key, site?.[key]);
    if (!href) return null;
    return { key, Icon, label, href };
  }).filter(Boolean);

  if (!links.length) return null;

  return (
    <div className="fixed z-40 bottom-6 right-4 sm:bottom-8 sm:right-6">
      {/* Expanded stack of icons */}
      <div
        className={`mb-4 flex flex-col items-center gap-3 transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {links.map(({ key, Icon, label, href }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 rounded-full border border-cream/35 bg-noir/80 backdrop-blur-sm flex items-center justify-center text-cream/80 hover:text-cream hover:border-cream transition-all duration-300"
          >
            <Icon className="w-4 h-4" />
          </a>
        ))}

        {/* Close button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close connect menu"
          className="w-10 h-10 rounded-full border border-cream/40 bg-noir/90 backdrop-blur-sm flex items-center justify-center text-cream/80 hover:text-cream hover:border-cream transition-all duration-300"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      {/* Main toggle button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open connect menu"
        className={`w-12 h-12 rounded-full border border-cream/40 bg-noir/90 backdrop-blur-sm flex items-center justify-center text-cream/80 hover:text-cream hover:border-cream transition-all duration-300 shadow-lg ${
          open ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <FaShareAlt className="w-5 h-5" />
      </button>
    </div>
  );
}

