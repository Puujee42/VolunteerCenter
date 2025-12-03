import type { NextConfig } from "next";

const nextConfig = {
  // Add this 'images' configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '**', // Allow any path from this host
      },
    ],
  },
};

module.exports = nextConfig;