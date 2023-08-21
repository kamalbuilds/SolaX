/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: 'http://localhost:3000/',
        pathname: '/solana-labs/**',
      },
    ],
  },
}

module.exports = nextConfig
