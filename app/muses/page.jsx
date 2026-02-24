import Link from 'next/link';
import Image from 'next/image';
import { getMuses } from '@/lib/api';
import { isValidImageUrl } from '@/lib/image';

export const metadata = {
  title: 'Muses — Venusescort',
  description: 'Creation is erotic. Eroticism is deliberate. A Muse holds both.',
};

export default async function MusesPage() {
  const muses = await getMuses();

  return (
    <div className="pt-14 min-h-screen">
      <section className="py-16 px-4">
        <div className="max-w-[1600px] mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {muses.map((m) => (
            <Link key={m._id} href={`/muses/${m.slug}`} className="group">
              <div className="aspect-[3/4] relative bg-noir-light overflow-hidden rounded-sm mb-4">
                {m.imageUrl && isValidImageUrl(m.imageUrl) ? (
                  <Image
                    src={m.imageUrl}
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
              <p className="font-serif text-xl text-noir">{m.name}</p>
              {m.title && <p className="text-sm text-noir/70">{m.title}</p>}
            </Link>
          ))}
        </div>
        </div>
      </section>
    </div>
  );
}
