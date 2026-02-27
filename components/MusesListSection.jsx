'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { isValidImageUrl } from '@/lib/image';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const UPLOADS_BASE = API_BASE.replace(/\/api\/?$/, '');

const TABS = [
  { slug: 'all', label: 'ALL' },
  { slug: 'kink', label: 'KINK' },
  { slug: 'somatics', label: 'SOMATICS' },
  { slug: 'femme', label: 'FEMME' },
];

function hasDiscipline(muse, slug) {
  const disciplines = muse.disciplines || [];
  return disciplines.some((d) => (typeof d === 'object' ? d.slug : d) === slug);
}

export default function MusesListSection({ muses = [] }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredMuses = useMemo(() => {
    if (activeTab === 'all') return muses;
    return muses.filter((m) => hasDiscipline(m, activeTab));
  }, [muses, activeTab]);

  return (
    <div className="pt-14 min-h-screen">
      <section className="py-16 px-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl text-noir mb-6">MUSES</h1>
            <p className="text-noir/80 text-lg">
              Creation is erotic. Eroticism is deliberate. A Muse holds both.
            </p>
            <p className="text-noir/60 mt-4">Three ways to enter the House.</p>
            <Link
              href="/disciplines"
              className="inline-block mt-6 text-sm tracking-widest uppercase text-noir/70 hover:text-noir border-b border-noir/30"
            >
              Disciplines
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-8 sm:gap-12 mb-12">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredMuses.map((m) => {
              const rawUrl = m.imageUrl || '';
              const imageSrc = rawUrl.startsWith('/') ? `${UPLOADS_BASE}${rawUrl}` : rawUrl;
              const hasImage =
                !!imageSrc && (rawUrl.startsWith('/') || isValidImageUrl(imageSrc));

              return (
                <Link key={m._id} href={`/muses/${m.slug}`} className="group">
                  <div className="aspect-[3/4] relative bg-noir/5 overflow-hidden rounded-sm mb-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] group-hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                    {hasImage ? (
                      <Image
                        src={imageSrc}
                        alt={m.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cream/40 font-serif text-3xl">
                        {m.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="font-serif text-xl tracking-wide text-noir">{m.name}</p>
                  {m.title && (
                    <p className="text-sm text-noir/60 tracking-[0.02em] mt-0.5">{m.title}</p>
                  )}
                  {m.disciplines?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.disciplines.map((d) => (
                        <span
                          key={typeof d === 'object' ? d._id : d}
                          className="text-[10px] uppercase tracking-wider text-noir/50"
                        >
                          {typeof d === 'object' ? d.title : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
          {filteredMuses.length === 0 && (
            <p className="text-center text-noir/50 py-12">No muses in this filter yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
