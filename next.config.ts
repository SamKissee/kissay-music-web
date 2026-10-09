import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hygraph asset hosts plus any https host, so pasted external image URLs
    // (coverImageUrl / pictureUrl) render through next/image too.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.graphassets.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
