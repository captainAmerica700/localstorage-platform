import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { absoluteUrl, lastContentUpdate } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: lastContentUpdate,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  for (const page of source.getPages()) {
    const url = absoluteUrl(page.url);

    if (seen.has(url)) {
      continue;
    }

    seen.add(url);
    routes.push({
      url,
      lastModified: lastContentUpdate,
      changeFrequency: page.url === '/docs' ? 'weekly' : 'monthly',
      priority: page.url === '/docs' ? 0.9 : 0.7,
    });
  }

  return routes;
}
