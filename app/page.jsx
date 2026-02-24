import Link from 'next/link';
import Image from 'next/image';
import { getSite, getMuses, getDisciplines } from '@/lib/api';
import { isValidImageUrl } from '@/lib/image';
import MusesSection from '@/components/MusesSection';

const HERO_BG =
  'https://static.wixstatic.com/media/nsplsh_63694f354c3870696e3841~mv2_d_4480_6720_s_4_2.jpg';

const DISCIPLINE_INTROS = {
  kink: { tagline: 'The art of intensity.' },
  somatics: { tagline: 'Slow, deliberate, unnervingly honest.' },
  femme: { tagline: 'Where the erotic fully belongs to her.' },
};

export default async function HomePage() {
  const [site, muses, disciplines] = await Promise.all([
    getSite(),
    getMuses(),
    getDisciplines(),
  ]);

  const brandName = site?.brandName || 'Venusescort';
  const slogan = site?.slogan || 'A standards-based collective of untamed muses.';
  const heroImageUrl =
    (site?.heroImageUrl && isValidImageUrl(site.heroImageUrl) ? site.heroImageUrl : null) ||
    HERO_BG;

  return (
    <div>
      {/* Hero — full viewport, brand center, tagline bottom-right */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageUrl}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-noir/40" />
        </div>
        <div className="relative z-10 w-full max-w-[1600px] mx-auto min-h-screen flex flex-col items-center justify-center">
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl text-cream tracking-tight text-center">
            {brandName.toUpperCase()}
          </h1>
          <p className="absolute bottom-8 right-8 text-cream/90 text-sm max-w-xs text-right tracking-wide">
            {slogan}
          </p>
        </div>
      </section>

      {/* Disciplines — 100vh, centered V layout, shiny gradient text */}
      <section className="relative min-h-screen flex items-center justify-center py-16 bg-gradient-to-br from-noir via-[#1a1812] to-noir">
        <div className="max-w-[1600px] mx-auto w-full px-6 sm:px-12 md:px-16 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[1fr_1fr] gap-y-16 md:gap-y-20 gap-x-8 items-center w-full min-h-[55vh] md:min-h-[70vh]">
            {/* Row 1: KINK left, empty, FEMME right */}
            <div className="md:justify-self-start text-center md:text-left order-1 flex flex-col justify-center min-h-[140px] md:min-h-[180px]">
              {(() => {
                const bySlug = Object.fromEntries(disciplines.map((d) => [d.slug, d]));
                const k = bySlug.kink;
                return (
                  <Link href="/disciplines" className="group block">
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] leading-none tracking-[0.2em] font-semibold text-shiny group-hover:opacity-90 transition-opacity">
                      {(k?.title || 'Kink').toUpperCase()}
                    </h2>
                    <p className="mt-3 text-lg sm:text-[19px] tracking-[0.06em] text-cream/70 font-light">
                      {DISCIPLINE_INTROS.kink?.tagline || k?.definition || 'The art of intensity.'}
                    </p>
                  </Link>
                );
              })()}
            </div>
            <div className="hidden md:block order-2" />
            <div className="md:justify-self-end text-center md:text-right order-3 flex flex-col justify-center min-h-[140px] md:min-h-[180px]">
              {(() => {
                const bySlug = Object.fromEntries(disciplines.map((d) => [d.slug, d]));
                const f = bySlug.femme;
                return (
                  <Link href="/disciplines" className="group block">
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] leading-none tracking-[0.2em] font-semibold text-shiny group-hover:opacity-90 transition-opacity">
                      {(f?.title || 'Femme').toUpperCase()}
                    </h2>
                    <p className="mt-3 text-lg sm:text-[19px] tracking-[0.06em] text-cream/70 font-light">
                      {DISCIPLINE_INTROS.femme?.tagline || f?.definition || 'Where the erotic fully belongs to her.'}
                    </p>
                  </Link>
                );
              })()}
            </div>
            {/* Row 2: empty, SOMATICS center, empty */}
            <div className="hidden md:block order-4" />
            <div className="flex flex-col justify-center items-center order-5 md:col-start-2 md:row-start-2 min-h-[140px] md:min-h-[180px]">
              {(() => {
                const bySlug = Object.fromEntries(disciplines.map((d) => [d.slug, d]));
                const s = bySlug.somatics;
                return (
                  <Link href="/disciplines" className="group block text-center">
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] leading-none tracking-[0.2em] font-semibold text-shiny group-hover:opacity-90 transition-opacity">
                      {(s?.title || 'Somatics').toUpperCase()}
                    </h2>
                    <p className="mt-3 text-lg sm:text-[19px] tracking-[0.06em] text-cream/70 font-light">
                      {DISCIPLINE_INTROS.somatics?.tagline || s?.definition || 'Slow, deliberate, unnervingly honest.'}
                    </p>
                  </Link>
                );
              })()}
            </div>
            <div className="hidden md:block order-6" />
          </div>
        </div>
      </section>

      {/* Muses — tabs + Swiper carousel */}
      <MusesSection muses={muses} disciplines={disciplines} />

      {/* Quote + CTA */}
      <section className="py-16 px-4 bg-cream-dark">
        <div className="max-w-[1600px] mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-serif text-xl text-noir mb-8">
            Only those who hold the standard enter the House.
          </p>
          <Link
            href="/manifesto"
            className="inline-block px-6 py-3 border border-noir text-noir font-medium tracking-widest uppercase hover:bg-noir hover:text-cream transition-colors"
          >
            The Manifesto
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
}
