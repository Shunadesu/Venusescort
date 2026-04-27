'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { isValidImageUrl } from '@/lib/image';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const UPLOADS_BASE = API_BASE.replace(/\/api\/?$/, '');

function resolveImageUrl(raw) {
  if (!raw) return null;
  if (raw.startsWith('/')) return `${UPLOADS_BASE}${raw}`;
  if (isValidImageUrl(raw)) return raw;
  return null;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

function MuseCard({ muse, index }) {
  const imageSrc = resolveImageUrl(muse.imageUrl);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group"
    >
      <Link href={`/muses/${muse.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out bg-noir/5">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={muse.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-noir/10 to-noir/5 text-noir/25 font-serif text-6xl">
              {muse.name?.charAt(0) || '?'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/30/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <h3 className="font-serif text-white text-lg sm:text-xl tracking-wide drop-shadow-md">
              {(muse.name || '').toUpperCase()}
            </h3>
            {muse.title && (
              <p className="text-white/75 text-xs sm:text-sm mt-1.5 line-clamp-2">
                {muse.title}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function MusesListSection({ muses: rawMuses = [] }) {
  const muses = Array.isArray(rawMuses) ? rawMuses : [];

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

          {muses.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8"
              initial="hidden"
              animate="visible"
            >
              {muses.map((m, i) => (
                <MuseCard key={m._id} muse={m} index={i} />
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-noir/50 py-12">No muses available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
