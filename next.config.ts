import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  transpilePackages: ['react-globe.gl', 'three-globe', 'globe.gl'],
};

export default nextConfig;
