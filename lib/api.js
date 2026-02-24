const BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window === 'undefined' ? 'http://localhost:5000/api' : '/api');

export async function getSite() {
  const res = await fetch(`${BASE}/site`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getMuses(featured = false) {
  const url = featured ? `${BASE}/muses?featured=true` : `${BASE}/muses`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getMuseBySlug(slug) {
  const res = await fetch(`${BASE}/muses/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getDisciplines() {
  const res = await fetch(`${BASE}/disciplines`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getDisciplineBySlug(slug) {
  const res = await fetch(`${BASE}/disciplines/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getManifesto() {
  const res = await fetch(`${BASE}/manifesto`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getContactChannels() {
  const res = await fetch(`${BASE}/contact`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export function getAuthApi() {
  return typeof window === 'undefined' ? 'http://localhost:5000/api' : '/api';
}
