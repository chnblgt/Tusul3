/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://premium-scone-shoplift.ngrok-free.dev/:path*',
      },
    ];
  },
};

module.exports = nextConfig;