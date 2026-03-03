import { getContactChannels, getSite } from '@/lib/api';
import ContactForm from '@/components/ContactForm';
import ContactAccordion from '@/components/ContactAccordion';

export const metadata = {
  title: 'Contact — Venusescort',
  description: 'Get in touch. Enquiries, introductions, and House liaison.',
};

const DEFAULT_INTRO = `Book a High Class Escort date via the form, email, or by calling the agency. We help with organising and planning your date and choosing the right companion.

Our models work independently. For sexual practices, there is an unconditional condom requirement.`;

const DEFAULT_ACCORDIONS = [
  {
    title: 'Order formula',
    body: 'Details about how to place a booking can be arranged on request.',
  },
  {
    title: 'Payment options',
    body: 'Payment options (bank transfer, cash, etc.) can be discussed when you get in touch.',
  },
];

export default async function ContactPage() {
  const [channels, site] = await Promise.all([getContactChannels(), getSite()]);
  const visibleChannels = Array.isArray(channels) ? channels.filter((c) => c.visible !== false) : [];
  const intro = (site?.contactIntro || DEFAULT_INTRO).trim();
  const accordions =
    Array.isArray(site?.contactAccordions) && site.contactAccordions.length > 0
      ? site.contactAccordions.filter((a) => a && (a.title || a.body))
      : DEFAULT_ACCORDIONS;
  const agencyHours = (site?.agencyHours || '').trim();

  return (
    <div className="pt-14 min-h-screen bg-cream">
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-start">
            {/* Left: Information */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-noir/50 mb-2">
                Information
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-noir mb-6 tracking-[0.08em]">
                Information
              </h1>
              <div className="text-noir/80 text-sm sm:text-base leading-relaxed space-y-4 mb-8">
                {intro.split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <ContactAccordion items={accordions} />
            </div>

            {/* Right: Contact */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-noir/50 mb-2">
                Contact
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-noir mb-8 tracking-[0.08em]">
                Contact
              </h2>

              <div className="space-y-6 mb-10">
                {visibleChannels.map((ch, i) => (
                  <div key={i}>
                    <p className="text-xs uppercase tracking-wider text-noir/50 mb-1">
                      {ch.role || ch.label}
                    </p>
                    {ch.email && (
                      <a
                        href={`mailto:${ch.email}`}
                        className="text-noir font-medium underline hover:text-noir/80"
                      >
                        {ch.email}
                      </a>
                    )}
                    {ch.link && (
                      <a
                        href={ch.link.startsWith('http') ? ch.link : `tel:${ch.link.replace(/\s/g, '')}`}
                        target={ch.link.startsWith('http') ? '_blank' : undefined}
                        rel={ch.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-noir font-medium underline hover:text-noir/80 block mt-1"
                      >
                        {ch.label || ch.link}
                      </a>
                    )}
                    {!ch.email && !ch.link && (
                      <p className="text-noir/60">—</p>
                    )}
                  </div>
                ))}
                {agencyHours && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-noir/50 mb-1">
                      Agency hours
                    </p>
                    <p className="text-noir/80 text-sm leading-relaxed whitespace-pre-line">
                      {agencyHours}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-noir/10">
                <ContactForm className="mt-0" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
