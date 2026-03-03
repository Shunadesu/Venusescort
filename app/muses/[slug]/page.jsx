import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMuseBySlug } from '@/lib/api';
import MuseGalleryLightbox from '@/components/MuseGalleryLightbox';

const PROFILE_LABELS = {
  hometown: 'Hometown',
  availableIn: 'Available in',
  age: 'Age',
  occupation: 'Occupation',
  height: 'Height',
  measurements: 'Measurements',
  braSize: 'Bra size',
  shoeSize: 'Shoe size',
  wardrobe: 'Wardrobe',
  nationality: 'Nationality',
  languages: 'Languages',
  interests: 'Interests',
  hobbiesSports: 'Hobbys/Sports',
  drinks: 'Drinks',
  cuisine: 'Cuisine',
  music: 'Music',
  perfume: 'Perfume',
  tattoos: 'Tattoos',
  piercings: 'Piercings',
  smoker: 'Smoker',
  eyecolour: 'Eyecolour',
};

function getProfileRows(muse) {
  const profile = muse.profile && typeof muse.profile === 'object' ? muse.profile : {};
  const rows = [];
  for (const [key, value] of Object.entries(profile)) {
    if (value && String(value).trim()) {
      rows.push({ key: PROFILE_LABELS[key] || key, value: String(value).trim() });
    }
  }
  if (rows.length > 0) return rows;
  return parseBio(muse.bio || '').profileRows;
}

function parseBio(bio) {
  if (!bio || !bio.trim()) return { intro: '', profileRows: [] };
  const normalized = bio.trim();
  const profileIndex = normalized.toUpperCase().indexOf('PROFILE');
  let intro = normalized;
  let profileBlock = '';
  if (profileIndex >= 0) {
    intro = normalized.slice(0, profileIndex).trim();
    profileBlock = normalized.slice(profileIndex + 7).trim();
  }
  const profileRows = [];
  const lines = profileBlock.split(/\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx > 0 && colonIdx < trimmed.length - 1) {
      const key = trimmed.slice(0, colonIdx).trim();
      const value = trimmed.slice(colonIdx + 1).trim();
      if (key && value) profileRows.push({ key, value });
    }
  }
  return { intro, profileRows };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const UPLOADS_BASE = API_BASE.replace(/\/api\/?$/, '');

function toDisplayImageUrl(src) {
  if (!src || typeof src !== 'string') return '';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return UPLOADS_BASE ? `${UPLOADS_BASE}${src}` : src;
  return UPLOADS_BASE ? `${UPLOADS_BASE}/${src}` : `/${src}`;
}

export async function generateMetadata({ params }) {
  const muse = await getMuseBySlug(params.slug);
  if (!muse) {
    return { title: 'Muse not found — Venusescort' };
  }
  const baseTitle = muse.name || 'Muse';
  const desc = muse.intro || muse.bio || muse.title || 'A muse of the House.';
  return {
    title: `${baseTitle} — Venusescort`,
    description: typeof desc === 'string' ? desc.slice(0, 160) : 'A muse of the House.',
  };
}

export default async function MuseDetailPage({ params }) {
  const muse = await getMuseBySlug(params.slug);
  if (!muse) notFound();

  const mainImage = toDisplayImageUrl(muse.imageUrl) || toDisplayImageUrl(muse.gallery?.[0]);
  const images = [
    muse.imageUrl,
    ...(Array.isArray(muse.gallery) ? muse.gallery : []),
  ]
    .filter(Boolean)
    .map(toDisplayImageUrl)
    .filter(Boolean);

  const introText =
    muse.intro && muse.intro.trim()
      ? muse.intro.trim()
      : parseBio(muse.bio || '').intro;
  const profileRows = getProfileRows(muse);
  const eroticPrefs = Array.isArray(muse.eroticPreferences)
    ? muse.eroticPreferences.filter(Boolean)
    : [];

  const profile = muse.profile && typeof muse.profile === 'object' ? muse.profile : {};
  const taglineParts = [];
  if (profile.hometown) taglineParts.push(profile.hometown);
  if (profile.age) taglineParts.push(profile.age);
  if (muse.disciplines?.length) {
    taglineParts.push(muse.disciplines.map((d) => (d && d.title) || d).join(', '));
  }
  const tagline = taglineParts.length ? taglineParts.join(' | ') : '';

  return (
    <div className="pt-14 min-h-screen bg-cream">
      {/* Hero: full-width model image */}
      <section className="relative w-full aspect-[16/10] sm:aspect-[3/1] max-h-[70vh] bg-noir">
        {mainImage ? (
          <img
            src={mainImage}
            alt={muse.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-cream/30 font-serif text-6xl">
            {muse.name?.charAt(0) ?? '?'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream font-bold uppercase tracking-wide">
            {muse.name}
          </h1>
          {tagline && (
            <p className="mt-1 text-cream/90 text-sm sm:text-base">{tagline}</p>
          )}
        </div>
      </section>

      {/* Content: intro + profile + preferences | sticky image */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto">
          <Link
            href="/muses"
            className="inline-flex items-center gap-1 text-xs tracking-[0.25em] uppercase text-noir/50 hover:text-noir transition-colors"
          >
            ← Muses
          </Link>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: intro, profile table, erotic preferences */}
            <div className="lg:col-span-7 space-y-10">
              {muse.title && (
                <p className="font-serif text-lg text-noir/80">{muse.title}</p>
              )}

              {introText && (
                <div className="text-noir/85 leading-relaxed whitespace-pre-line">
                  {introText}
                </div>
              )}

              {profileRows.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-noir mb-4">
                    Profile
                  </h2>
                  <div className="rounded-sm border border-noir/10 overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-noir/10">
                        {profileRows.map((row, i) => (
                          <tr
                            key={i}
                            className={i % 2 === 0 ? 'bg-noir/[0.03]' : 'bg-cream'}
                          >
                            <td className="px-4 py-3 font-medium text-noir/60 w-[38%] align-top">
                              {row.key}
                            </td>
                            <td className="px-4 py-3 text-noir">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {eroticPrefs.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-noir mb-4">
                    My preferences in erotic experiences
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {eroticPrefs.map((pref, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-sm bg-cream-dark/80 text-noir/90 text-sm border border-noir/10"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* My Perfect Date: ngay dưới preferences, trong luồng nội dung */}
              <section
                className="relative w-full min-h-[380px] sm:min-h-[420px] flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 rounded-sm overflow-hidden -mx-0 sm:-mx-2"
                style={{
                  backgroundImage: `url(https://intimate-escort.com/wp-content/uploads/2025/03/JENNY_INTIMATE-7-ZENSIERT_11zon-scaled.webp)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-noir/70" />
                <div className="relative z-10 max-w-2xl mx-auto text-center">
                  <h2 className="text-cream font-semibold text-xl sm:text-2xl tracking-[0.2em] uppercase mb-6 sm:mb-8">
                    My Perfect Date
                  </h2>
                  <blockquote className="relative text-cream text-sm sm:text-base leading-relaxed text-left sm:text-center">
                    <span className="absolute -top-2 -left-1 sm:left-0 text-5xl sm:text-6xl text-cream/40 font-serif leading-none select-none">
                      "
                    </span>
                    <span className="absolute -bottom-4 -right-1 sm:right-0 text-5xl sm:text-6xl text-cream/40 font-serif leading-none select-none">
                      "
                    </span>
                    <p className="px-6 sm:px-8 py-2">
                      Mein perfektes Escort-Date ist lustig, voll mit bitte seeehr gutem Sex, du bist ein
                      gepflegter und attraktiver Gentleman und wir zwei machen uns eine unvergessliche Zeit.
                      Es ist mir vor allem wichtig, dass sich beide wohlfühlen in der Umgebung und alles
                      ganz locker ist. Ich bin sehr vielseitig, einerseits sehr selbstbewusst und
                      aufgeschlossen, kann aber auch ne ganz ruhige süße Maus sein. Ein Kennenlernen in
                      einer netten Bar oder in einem Restaurant, dazu ein paar Drinks und intime Gespräche
                      (vielleicht schon ein kleiner Teaser was später erwartet), finde ich super. Am Ende
                      ist mir wichtig, dass wir beide erfüllt aus dem Date herausgehen. Keep it simple and
                      spicy!
                    </p>
                  </blockquote>
                </div>
              </section>

              {!introText && profileRows.length === 0 && eroticPrefs.length === 0 && muse.bio && (
                <div className="text-noir/80 leading-relaxed whitespace-pre-line">
                  {muse.bio}
                </div>
              )}
            </div>

            {/* Right: sticky image + CTA + gallery lightbox */}
            <aside className="lg:col-span-5">
              <MuseGalleryLightbox
                mainImage={mainImage}
                images={images}
                museName={muse.name}
                tagline={tagline}
              />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
