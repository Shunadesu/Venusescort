import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMuseBySlug } from '@/lib/api';
import MuseGallery from '@/components/MuseGallery';

export async function generateMetadata({ params }) {
  const muse = await getMuseBySlug(params.slug);
  if (!muse) {
    return {
      title: 'Muse not found — Venusescort',
    };
  }

  const baseTitle = muse.name || 'Muse';
  const fullTitle = `${baseTitle} — Venusescort`;

  return {
    title: fullTitle,
    description: muse.bio || muse.title || 'A muse of the House.',
  };
}

export default async function MuseDetailPage({ params }) {
  const muse = await getMuseBySlug(params.slug);
  if (!muse) {
    notFound();
  }

  const images = [
    muse.imageUrl,
    ...(Array.isArray(muse.gallery) ? muse.gallery : []),
  ]
    .filter(Boolean)
    // For uploads coming from BE proxy, store as /uploads/... so Next rewrites can handle it.
    .map((src) =>
      typeof src === 'string' && src.startsWith('http') && src.includes('/uploads/')
        ? src.slice(src.indexOf('/uploads'))
        : src
    );

  const disciplines = Array.isArray(muse.disciplines)
    ? muse.disciplines
    : [];

  return (
    <div className="pt-14 min-h-screen bg-cream">
      <section className="py-16 px-4">
        <div className="max-w-[1600px] mx-auto">
          <Link
            href="/muses"
            className="text-xs tracking-[0.25em] uppercase text-noir/50 hover:text-noir transition-colors"
          >
            ← Muses
          </Link>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 md:gap-16 items-start">
            {/* Images / gallery */}
            <MuseGallery name={muse.name} images={images} />

            {/* Details */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-noir">
                {muse.name}
              </h1>
              {muse.title && (
                <p className="mt-2 text-noir/80 text-lg">{muse.title}</p>
              )}

              {muse.bio && (
                <p className="mt-6 text-noir/80 leading-relaxed max-w-md text-sm sm:text-base">
                  {muse.bio}
                </p>
              )}

              {disciplines.length > 0 && (
                <div className="mt-8">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-noir/50 mb-2">
                    Disciplines
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {disciplines.map((d) => (
                      <span
                        key={typeof d === 'object' ? d._id : d}
                        className="inline-flex px-3 py-1 text-xs uppercase tracking-[0.16em] bg-noir/5 text-noir/80 border border-noir/10"
                      >
                        {typeof d === 'object' ? d.title : d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
