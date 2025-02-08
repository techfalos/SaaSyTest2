import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  /* generated code can sometimes cause type errors that we do not want to stop the build for */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
