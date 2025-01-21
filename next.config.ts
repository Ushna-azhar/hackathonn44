import { NextConfig } from 'next';
import { i18n } from './next-i18next.config'; // Import i18n config

const nextConfig: NextConfig = {
  i18n,
  images: {
    domains: ['template-03-api.vercel.app', 'randomuser.me'],
  },
};

export default nextConfig;
