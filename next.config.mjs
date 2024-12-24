/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bls.lazonebleue.com",
      },
      {
        protocol: "https",
        hostname: "af934bhpat.preview.infomaniak.website",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
