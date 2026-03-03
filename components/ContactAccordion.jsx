'use client';

import { useState } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';

export default function ContactAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!items.length) return null;

  return (
    <div className="space-y-2">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const hasBody = item.body && item.body.trim();
        return (
          <div
            key={idx}
            className="border border-noir/15 rounded-sm overflow-hidden bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-noir hover:bg-noir/[0.03] transition-colors"
            >
              <span className="font-medium text-sm tracking-[0.02em]">
                {item.title || 'Section'}
              </span>
              <HiOutlineChevronRight
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-90' : ''
                }`}
              />
            </button>
            {hasBody && (
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? 'max-h-[500px]' : 'max-h-0'
                }`}
              >
                <div className="px-4 pb-4 pt-0 text-sm text-noir/80 leading-relaxed whitespace-pre-line border-t border-noir/10">
                  {item.body}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
