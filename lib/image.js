/**
 * Check if URL is safe for Next.js Image optimization.
 * Returns false for known non-image URLs (social links, etc.) that cause 400 errors.
 */
const NON_IMAGE_HOSTS = [
  'facebook.com',
  'fb.com',
  'twitter.com',
  'x.com',
  'instagram.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
];

export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return !NON_IMAGE_HOSTS.some((h) => host === h || host.endsWith('.' + h));
  } catch {
    return false;
  }
}
