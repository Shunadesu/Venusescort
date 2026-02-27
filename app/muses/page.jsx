import { getMuses } from '@/lib/api';
import MusesListSection from '@/components/MusesListSection';

export const metadata = {
  title: 'Muses — Venusescort',
  description: 'Creation is erotic. Eroticism is deliberate. A Muse holds both.',
};

export default async function MusesPage() {
  const muses = await getMuses();

  return <MusesListSection muses={muses} />;
}
