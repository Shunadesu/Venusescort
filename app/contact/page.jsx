import { getContactChannels, getSite } from '@/lib/api';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact — Venusescort',
  description: 'Get in touch. Curation and House Liaison.',
};

export default async function ContactPage() {
  const [channels, site] = await Promise.all([getContactChannels(), getSite()]);
  const instagramUrl = site?.instagramUrl || 'https://www.instagram.com/';

  return (
    <div className="pt-14 min-h-screen">
      <section className="py-16 px-4">
        <div className="max-w-[1600px] mx-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl text-noir mb-16">CONTACT</h1>
          <div className="space-y-12">
            {channels.map((ch, i) => (
              <div key={i}>
                <h2 className="font-serif text-2xl text-noir mb-2">{ch.label || ch.role}</h2>
                {ch.role && ch.label !== ch.role && (
                  <p className="text-sm uppercase tracking-wider text-noir/60 mb-2">{ch.role}</p>
                )}
                {ch.email ? (
                  <a
                    href={`mailto:${ch.email}`}
                    className="text-noir/80 hover:text-noir underline"
                  >
                    {ch.email}
                  </a>
                ) : (
                  <p className="text-noir/60">Contact info available soon.</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-noir/10">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm tracking-widest uppercase text-noir/70 hover:text-noir"
            >
              Instagram
            </a>
          </div>
          <ContactForm className="mt-16" />
        </div>
        </div>
      </section>
    </div>
  );
}
