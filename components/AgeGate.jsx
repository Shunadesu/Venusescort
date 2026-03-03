'use client';

import { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';

const STORAGE_KEY = 'venusescort_age_verified';

export default function AgeGate({ children }) {
  const [verified, setVerified] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const stored = typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY);
      setVerified(stored === 'true');
    } catch {
      setVerified(false);
    }
  }, [mounted]);

  const handleConfirm = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, 'true');
        setVerified(true);
      }
    } catch {}
  };

  const handleLeave = () => {
    if (typeof window !== 'undefined') {
      window.history.length > 1 ? window.history.back() : (window.location.href = 'https://www.google.com');
    }
  };

  if (mounted && verified) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-noir">
      <div
        className="relative w-full max-w-md rounded-lg bg-white shadow-xl border border-noir/10 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        aria-describedby="age-gate-desc"
      >
        <button
          type="button"
          onClick={handleLeave}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded text-noir/50 hover:text-noir hover:bg-noir/5 transition-colors"
          aria-label="Close"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>
        <div className="pt-10 pb-6 px-8 text-center">
          <h1
            id="age-gate-title"
            className="font-serif text-xl sm:text-2xl font-semibold text-noir tracking-wide uppercase mb-4"
          >
            Content only for persons 18 and over
          </h1>
          <p id="age-gate-desc" className="text-noir/80 text-sm sm:text-base leading-relaxed mb-8">
            This website contains content intended exclusively for adults. If you are 18 years of age or older
            and choose to access erotic services and content, please click &ldquo;I am of age&rdquo;.
            Otherwise, please leave this page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-3 rounded-md bg-noir text-white font-medium text-sm tracking-wide uppercase hover:bg-noir/90 transition-colors"
            >
              I am of age
            </button>
            <button
              type="button"
              onClick={handleLeave}
              className="px-6 py-3 rounded-md border-2 border-noir text-noir font-medium text-sm tracking-wide uppercase hover:bg-noir/5 transition-colors"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
