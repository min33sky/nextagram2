/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'links.papareact.com',
      'cloudflare-ipfs.com',
      'placeimg.com',
      'loremflickr.com',
      'w.namu.la',
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com',
    ],
  },
};

module.exports = nextConfig;
