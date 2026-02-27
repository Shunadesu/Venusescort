'use client';

import { useState } from 'react';

export default function MuseGallery({ name, images = [] }) {
  const safeImages = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  if (safeImages.length === 0) {
    return (
      <div className="aspect-[3/4] bg-noir flex items-center justify-center text-cream/40 font-serif text-5xl">
        {name?.charAt(0) ?? '?'}
      </div>
    );
  }

  const current = safeImages[Math.min(activeIndex, safeImages.length - 1)];

  return (
    <div>
      <div className="aspect-[3/4] relative bg-noir overflow-hidden rounded-sm mb-4 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.35)]">
        <img
          src={current}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
          {safeImages.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 h-20 rounded-sm overflow-hidden border transition-all duration-200 ${
                idx === activeIndex
                  ? 'border-noir shadow-[0_0_0_1px_rgba(0,0,0,0.6)]'
                  : 'border-noir/10 hover:border-noir/40'
              }`}
            >
              <img src={src} alt={`${name} ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

