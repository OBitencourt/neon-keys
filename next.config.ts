import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      {
        protocol: "https",
        hostname: "shared.steamstatic.com",
        pathname: "/store_item_assets/steam/apps/**",
      },
      {
        protocol: "https",
        hostname: "shared.fastly.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "shared.akamai.steamstatic.com",
      },
    ],
  },
};

export default nextConfig;
