/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['yourwebsite.whatever.com'],
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // SEO-friendly URLs for listings
      {
        source: '/homes/:state/:city/:slug',
        destination: '/listing/:slug',
      },
      // Neighborhood pages
      {
        source: '/neighborhoods/:state/:city/:neighborhood',
        destination: '/neighborhood/:state/:city/:neighborhood',
      },
    ];
  },
};

module.exports = nextConfig;
