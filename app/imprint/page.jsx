export const metadata = {
  title: 'Imprint — Venusescort',
  description: 'Key information about the entity behind Venusescort.',
};

export default function ImprintPage() {
  return (
    <div className="pt-14 min-h-screen bg-cream-50">
      <section className="py-16 px-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl sm:text-5xl text-noir mb-10">Imprint</h1>
            <p className="text-noir/70 text-sm mb-8">
              This Imprint provides essential information about responsibility for the content of
              this website. Some details are placeholders and should be adapted to the actual legal
              requirements of the jurisdiction in which the House operates.
            </p>

            <div className="space-y-10 text-noir/80 leading-relaxed text-sm sm:text-base">
              <section>
                <h2 className="font-serif text-xl text-noir mb-3">1. Operator of the website</h2>
                <p className="mb-1 font-semibold">Venusescort</p>
                <p className="text-noir/70">
                  [Registered entity or individual name]
                  <br />
                  [Registered address line 1]
                  <br />
                  [City, Postal code]
                  <br />
                  [Country]
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-noir mb-3">2. Contact</h2>
                <p>
                  For enquiries regarding this website or its content, please use the contact
                  details provided on the Contact page. For legal notices, please indicate clearly
                  that your message concerns the &quot;Imprint&quot;.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-noir mb-3">3. Editorial responsibility</h2>
                <p>
                  Unless otherwise indicated, editorial responsibility for the content of this site
                  lies with the entity named above. Imagery and descriptions are curated to respect
                  the privacy and autonomy of the muses while presenting the House&apos;s standards
                  and aesthetic.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-noir mb-3">4. Professional and regulatory information</h2>
                <p>
                  If local law requires the disclosure of specific regulatory registrations,
                  licensing bodies, or professional titles, they should be listed here. This section
                  is a placeholder and should be customised together with qualified legal counsel.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-noir mb-3">5. Liability for content and links</h2>
                <p className="mb-3">
                  The contents of this website are prepared with care. Nevertheless, we cannot
                  guarantee that all information is complete, accurate, or up to date. We reserve
                  the right to modify, limit, or remove content at any time.
                </p>
                <p>
                  This website may contain links to external sites. We have no influence over the
                  content of those external sites and accept no liability for them; the respective
                  providers are responsible for their own content.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-noir mb-3">6. Intellectual property</h2>
                <p>
                  All text, images, and design elements on this website are protected by copyright
                  and related rights. Any reproduction or use beyond personal, non‑commercial
                  purposes requires prior written permission.
                </p>
              </section>

              <p className="text-noir/60 text-xs mt-6">
                This Imprint is a template intended for general orientation only and does not
                replace jurisdiction‑specific legal advice.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

