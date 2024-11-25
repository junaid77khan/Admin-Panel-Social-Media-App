/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, 
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/data',
        destination: `${process.env.NEXT_PUBLIC_API_URL}`, 
      },
    ];
  },
};

module.exports = nextConfig;
