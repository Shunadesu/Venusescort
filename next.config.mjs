/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || 'https://kimphat.shop/api';
    const rootBase = apiBase.replace(/\/api\/?$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${rootBase}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

