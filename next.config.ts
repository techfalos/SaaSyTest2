import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  /* generated code can sometimes cause type errors that we do not want to stop the build for */
  typescript: {
    ignoreBuildErrors: true,
  },
  /* Rewrite /files/* to /api/files/* for file serving */
  async rewrites() {
    return [
      {
        source: '/files/:path*',
        destination: '/api/files/:path*',
      },
    ];
  },
  /* Security configurations */
  poweredByHeader: false, // Remove X-Powered-By header
  
  /* Additional security headers can be configured here or in middleware */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  /* Experimental security features */
  // Note: strictNextHead is no longer needed in Next.js 15.5+
  
  /* Output configuration for security */
  output: 'standalone', // Better for containerized deployments
  
  /* Disable source maps in production for security */
  productionBrowserSourceMaps: false,
};

export default nextConfig;
