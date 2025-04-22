/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['beije.co', 'static.beije.co'],
  },
};

module.exports = nextConfig; 