/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "easyprimemart.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "https://example.com",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
