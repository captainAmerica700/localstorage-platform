import { appName, gitConfig } from './shared';

export const siteUrl = 'https://localstorage-platform-docs.vercel.app';

export const siteDescription =
  'A type-safe browser storage library with namespaces, metadata, TTL, optional encryption, and group-based cleanup.';

export const siteKeywords = [
  'localStorage',
  'localstorage-platform',
  'browser storage',
  'web storage',
  'storage manager',
  'TypeScript storage',
  'TTL storage',
  'encrypted localStorage',
  'namespace storage',
  'frontend persistence',
];

export const siteAuthor = 'Jai Studios';

export const siteRepositoryUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export const defaultOgImage = '/icon.svg';

export const lastContentUpdate = new Date('2026-07-03');

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString();
}

export function getSoftwareJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: appName,
    description: siteDescription,
    codeRepository: siteRepositoryUrl,
    programmingLanguage: 'TypeScript',
    license: `${siteRepositoryUrl}/blob/main/LICENSE`,
    url: siteUrl,
    applicationCategory: 'DeveloperApplication',
    runtimePlatform: 'Web browser',
    author: {
      '@type': 'Organization',
      name: siteAuthor,
    },
  };
}

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteAuthor,
    url: siteRepositoryUrl,
  };
}

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: appName,
    description: siteDescription,
    url: siteUrl,
    publisher: {
      '@type': 'Organization',
      name: siteAuthor,
    },
  };
}
