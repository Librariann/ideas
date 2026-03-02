import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg'],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
