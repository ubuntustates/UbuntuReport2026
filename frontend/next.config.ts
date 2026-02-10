import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ✅ Allow images from any remote source (wildcard pattern)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
  },

  eslint: {
    // ✅ Prevent lint errors from failing your production Docker build
    ignoreDuringBuilds: true,
  },

  typescript: {
    // ✅ Disable type-checking during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
