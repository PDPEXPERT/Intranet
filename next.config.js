/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // trailingSlash para compatibilidad con hosting compartido (Hostinger)
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
