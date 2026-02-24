import Link from 'next/link';
import { getDisciplines } from '@/lib/api';

export const metadata = {
  title: 'Disciplines — Venusescort',
  description: 'The Three Disciplines: Kink, Somatics, Femme.',
};

export default async function DisciplinesPage() {
  const disciplines = await getDisciplines();

  return (
    <div className="pt-14 min-h-screen">
      <section className="py-16 px-4">
        <div className="max-w-[1600px] mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl text-noir mb-16">DISCIPLINES</h1>
          <div className="space-y-16">
            {disciplines.map((d) => (
              <article key={d._id}>
                <h2 className="font-serif text-2xl sm:text-3xl text-noir mb-4">
                  {d.title.toUpperCase()}
                </h2>
                {d.definition && (
                  <p className="text-noir/70 italic mb-2">{d.definition}</p>
                )}
                {d.description && (
                  <p className="text-noir/80 leading-relaxed mb-4">{d.description}</p>
                )}
                {d.includes?.length > 0 && (
                  <p className="text-noir/70 text-sm">
                    This can include: {d.includes.join(', ')}.
                  </p>
                )}
              </article>
            ))}
          </div>
          <div className="mt-16 pt-8 border-t border-noir/10">
            <Link
              href="/muses"
              className="inline-block px-6 py-3 border border-noir text-noir font-medium tracking-widest uppercase hover:bg-noir hover:text-cream transition-colors"
            >
              Begin
            </Link>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
