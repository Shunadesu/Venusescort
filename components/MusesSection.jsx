'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { isValidImageUrl } from '@/lib/image';
import 'swiper/css';
import 'swiper/css/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const UPLOADS_BASE = API_BASE.replace(/\/api\/?$/, '');

const TABS = [
  { slug: 'kink', label: 'KINK' },
  { slug: 'somatics', label: 'SOMATICS' },
  { slug: 'femme', label: 'FEMME' },
];

function hasDiscipline(muse, slug) {
  const disciplines = muse.disciplines || [];
  return disciplines.some((d) => (typeof d === 'object' ? d.slug : d) === slug);
}

function MuseSlide({ muse }) {
  const rawImages = useMemo(() => {
    const raws = [
      muse.imageUrl,
      ...(Array.isArray(muse.gallery) ? muse.gallery : []),
    ].filter(Boolean);
    // remove duplicates
    return Array.from(new Set(raws));
  }, [muse.imageUrl, muse.gallery]);

  const [index, setIndex] = useState(0);

  // Reset index when muse or gallery length changes
  useEffect(() => {
    setIndex(0);
  }, [muse._id, rawImages.length]);

  // Auto-rotate every 3s when there is more than one image
  useEffect(() => {
    if (rawImages.length <= 1) return undefined;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % rawImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [rawImages.length]);

  const currentRaw = rawImages[index] || '';
  let displaySrc = '';
  let useNextImage = false;

  if (currentRaw) {
    if (currentRaw.startsWith('/')) {
      displaySrc = `${UPLOADS_BASE}${currentRaw}`;
      useNextImage = false;
    } else if (isValidImageUrl(currentRaw)) {
      displaySrc = currentRaw;
      useNextImage = true;
    }
  }

  const hasImage = !!displaySrc;

  return (
    <Link href={`/muses/${muse.slug}`} className="group block">
      <div className="aspect-[3/4] relative bg-noir/5 overflow-hidden rounded-sm mb-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] group-hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] transition-shadow duration-300">
        {hasImage ? (
          useNextImage ? (
            <Image
              src={displaySrc}
              alt={muse.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <img
              src={displaySrc}
              alt={muse.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cream/40 font-serif text-4xl">
            {muse.name.charAt(0)}
          </div>
        )}
      </div>
      <p className="font-serif text-lg tracking-wide text-noir">{muse.name}</p>
      {muse.title && (
        <p className="text-sm text-noir/60 tracking-[0.02em] mt-0.5">{muse.title}</p>
      )}
    </Link>
  );
}

export default function MusesSection({ muses = [], disciplines = [] }) {
  const [activeTab, setActiveTab] = useState('kink');

  const filteredMuses = useMemo(() => {
    return muses.filter((m) => hasDiscipline(m, activeTab));
  }, [muses, activeTab]);

  return (
    <section className="min-h-screen flex flex-col py-20 md:py-24 px-6 sm:px-8 md:px-12 bg-gradient-to-b from-cream via-cream to-cream-dark/95">
      {/* Title — refined, luxurious */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[20vh]">
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-noir text-center tracking-[0.35em] font-light">
          MUSES
        </h2>
        <span className="mt-4 block w-12 h-px bg-noir/40" aria-hidden />
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-10 sm:gap-14 mb-12">
        {TABS.map(({ slug, label }) => (
          <button
            key={slug}
            type="button"
            suppressHydrationWarning
            onClick={() => setActiveTab(slug)}
            className={`text-xs sm:text-sm tracking-[0.3em] uppercase transition-all duration-300 ${
              activeTab === slug
                ? 'text-noir font-medium border-b border-noir/90 pb-2'
                : 'text-noir/40 hover:text-noir/70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Swiper carousel */}
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="relative">
          <Swiper
            key={activeTab}
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation={{
              prevEl: '.muses-prev',
              nextEl: '.muses-next',
            }}
            className="!overflow-visible"
          >
            {filteredMuses.length > 0 ? (
              filteredMuses.map((m) => (
                <SwiperSlide key={m._id}>
                  <MuseSlide muse={m} />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="aspect-[3/4] flex items-center justify-center bg-noir/5 rounded-sm text-noir/50 font-serif">
                  No muses in this discipline yet.
                </div>
              </SwiperSlide>
            )}
          </Swiper>

          {/* Custom nav arrows */}
          <button
            type="button"
            suppressHydrationWarning
            className="muses-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 w-11 h-11 rounded-full bg-noir/90 text-cream/95 flex items-center justify-center hover:bg-noir hover:text-cream transition-all duration-300 shadow-lg disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Previous"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            suppressHydrationWarning
            className="muses-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 w-11 h-11 rounded-full bg-noir/90 text-cream/95 flex items-center justify-center hover:bg-noir hover:text-cream transition-all duration-300 shadow-lg disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Next"
          >
            <HiOutlineChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
