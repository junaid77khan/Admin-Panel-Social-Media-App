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
        destination: 'https://api.socialverseapp.com/admin/dashboard', 
      },
    ];
  },
};

module.exports = nextConfig;
