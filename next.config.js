/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://backend3-production-27e7.up.railway.app/:path*',
      },
    ];
  },
};

module.exports = nextConfig;