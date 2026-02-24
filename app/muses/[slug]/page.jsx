import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMuseBySlug } from '@/lib/api';
import { isValidImageUrl } from '@/lib/image';

export async function generateMetadata({ params }) {
  const muse = await getMuseBySlug(params.slug);
  if (!muse) return { title: 'Muse — Venusescort' };
  return {
    title: `${muse.name} — Venusescort`,
    description: muse.bio || muse.title,
  };
}

export default async function MuseDetailPage({ params }) {
  const muse = await getMuseBySlug(params.slug);
  if (!muse) notFound();

  const imageUrl =
    muse.imageUrl && isValidImageUrl(muse.imageUrl) ? muse.imageUrl : null;

  return (
    <div className="pt-14 min-h-screen">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/muses" className="text-sm tracking-widest uppercase text-noir/60 hover:text-noir mb-8 inline-block">
            ← Muses
          </Link>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="aspect-[3/4] relative bg-noir-light overflow-hidden rounded-sm">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={muse.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cream/40 font-serif text-6xl">
                  {muse.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="font-serif text-4xl text-noir mb-2">{muse.name}</h1>
              {muse.title && <p className="text-xl text-noir/70 mb-6">{muse.title}</p>}
              {muse.bio && <p className="text-noir/80 leading-relaxed">{muse.bio}</p>}
              {muse.disciplines?.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm uppercase tracking-wider text-noir/60 mb-2">Disciplines</p>
                  <div className="flex flex-wrap gap-2">
                    {muse.disciplines.map((d) => (
                      <span key={d._id} className="px-3 py-1 bg-noir/5 text-noir/80 text-sm">
                        {d.title}
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
