const BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function getSite() {
  try {
    const res = await fetch(`${BASE}/site`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getMuses(featured = false) {
  try {
    const url = featured ? `${BASE}/muses?featured=true` : `${BASE}/muses`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getMuseBySlug(slug) {
  try {
    const res = await fetch(`${BASE}/muses/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getDisciplines() {
  try {
    const res = await fetch(`${BASE}/disciplines`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getDisciplineBySlug(slug) {
  try {
    const res = await fetch(`${BASE}/disciplines/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getManifesto() {
  try {
    const res = await fetch(`${BASE}/manifesto`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getContactChannels() {
  try {
    const res = await fetch(`${BASE}/contact`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getFees() {
  try {
    const res = await fetch(`${BASE}/fees`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function getAuthApi() {
  return process.env.NEXT_PUBLIC_API_URL || '/api';
}

/** Submit a booking request (client-side only). */
export async function submitBooking(payload) {
  const res = await fetch(`${BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit booking');
  }
  return res.json();
}
