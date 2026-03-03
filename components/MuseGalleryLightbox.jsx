'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard } from 'swiper/modules';
import { HiOutlineX } from 'react-icons/hi';
import 'swiper/css';
import 'swiper/css/navigation';

export default function MuseGalleryLightbox({ mainImage, images = [], museName = '', tagline = '' }) {
  const [open, setOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const list = images.length > 0 ? images : mainImage ? [mainImage] : [];

  const openAt = useCallback((index) => {
    setInitialIndex(Math.max(0, Math.min(index, list.length - 1)));
    setOpen(true);
  }, [list.length]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const onEscape = (e) => { if (e.key === 'Escape') close(); };
      window.addEventListener('keydown', onEscape);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onEscape);
      };
    }
  }, [open, close]);

  if (list.length === 0) {
    return (
      <div className="sticky top-24 space-y-4">
        <div className="relative aspect-[3/4] max-h-[75vh] rounded-sm overflow-hidden bg-noir shadow-[0_8px_40px_-10px_rgba(0,0,0,0.25)]">
          <div className="absolute inset-0 flex items-center justify-center text-cream/30 font-serif text-5xl">
            {museName?.charAt(0) ?? '?'}
          </div>
        </div>
        <Link
          href="/contact"
          className="block w-full text-center py-3.5 rounded-sm bg-noir text-cream text-sm font-medium tracking-[0.15em] uppercase hover:bg-noir/90 transition-colors"
        >
          Book me →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-24 space-y-4">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="relative aspect-[3/4] max-h-[75vh] w-full rounded-sm overflow-hidden bg-noir shadow-[0_8px_40px_-10px_rgba(0,0,0,0.25)] text-left block group"
        >
          <img
            src={mainImage || list[0]}
            alt={museName}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/90 via-noir/30 to-transparent p-5 pt-16">
            <p className="text-cream font-serif font-bold text-2xl uppercase tracking-wide">
              {museName}
            </p>
            {tagline && (
              <p className="text-cream/90 text-sm mt-1">{tagline}</p>
            )}
          </div>
        </button>
        <Link
          href="/contact"
          className="block w-full text-center py-3.5 rounded-sm bg-noir text-cream text-sm font-medium tracking-[0.15em] uppercase hover:bg-noir/90 transition-colors"
        >
          Book me →
        </Link>
        {list.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 pt-2">
            {list.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => openAt(idx)}
                className="relative w-14 h-20 rounded-sm overflow-hidden border border-noir/15 hover:border-noir/40 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-noir/50"
              >
                <img
                  src={src}
                  alt={`${museName} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-noir/95"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-cream/50"
            aria-label="Close"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center px-14 py-12"
            onClick={(e) => e.stopPropagation()}
          >
            <Swiper
              modules={[Navigation, Keyboard]}
              initialSlide={initialIndex}
              spaceBetween={0}
              slidesPerView={1}
              navigation={{
                prevEl: '.lightbox-prev',
                nextEl: '.lightbox-next',
              }}
              keyboard={{ enabled: true }}
              className="w-full h-full"
            >
              {list.map((src, idx) => (
                <SwiperSlide key={idx} className="flex items-center justify-center">
                  <img
                    src={src}
                    alt={`${museName} ${idx + 1}`}
                    className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              type="button"
              className="lightbox-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none"
              aria-label="Previous image"
            >
              <span className="text-2xl">‹</span>
            </button>
            <button
              type="button"
              className="lightbox-next absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none"
              aria-label="Next image"
            >
              <span className="text-2xl">›</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
