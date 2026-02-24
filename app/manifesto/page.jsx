import { getManifesto } from '@/lib/api';

export const metadata = {
  title: 'Manifesto — Venusescort',
  description: 'The House manifesto. Standards and principles.',
};

export default async function ManifestoPage() {
  const data = await getManifesto();
  const items = data?.items ?? [];

  return (
    <div className="pt-14 min-h-screen">
      <section className="py-16 px-4">
        <div className="max-w-[1600px] mx-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl text-noir mb-16">MANIFESTO</h1>
          <div className="space-y-8">
            {items.map((item, i) => (
              <p key={i} className="text-noir/90 leading-relaxed">
                <span className="font-serif font-semibold text-noir">{item.number}.</span>{' '}
                {item.text}
              </p>
            ))}
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
