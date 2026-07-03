import type { MetadataRoute } from 'next';
import { siteDescription, siteUrl } from '@/lib/seo';
import { appName } from '@/lib/shared';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: appName,
    description: siteDescription,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: `${siteUrl}/icon.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
