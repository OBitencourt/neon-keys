import type { NextConfig } from "next";

const nextConfig = {
  images: {
  remotePatterns: [
    { protocol: "https", hostname: "lh3.googleusercontent.com" },
    { protocol: "https", hostname: "static.kinguin.net" },
  ],
},
};

export default nextConfig;
