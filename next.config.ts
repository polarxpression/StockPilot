
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
        {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  allowedDevOrigins: [
    '9000-firebase-studio-1757424973265.cluster-f73ibkkuije66wssuontdtbx6q.cloudworkstations.dev',
  ],
};

export default nextConfig;
