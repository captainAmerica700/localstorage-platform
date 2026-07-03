import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { appName } from '@/lib/shared';
import {
  absoluteUrl,
  defaultOgImage,
  getOrganizationJsonLd,
  getSoftwareJsonLd,
  getWebsiteJsonLd,
  siteAuthor,
  siteDescription,
  siteKeywords,
  siteUrl,
} from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: siteDescription,
  applicationName: appName,
  keywords: siteKeywords,
  authors: [
    {
      name: siteAuthor,
    },
  ],
  creator: siteAuthor,
  publisher: siteAuthor,
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: appName,
    description: siteDescription,
    url: siteUrl,
    siteName: appName,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: absoluteUrl(defaultOgImage),
        width: 64,
        height: 64,
        alt: appName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: appName,
    description: siteDescription,
    images: [absoluteUrl(defaultOgImage)],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  manifest: '/manifest.webmanifest',
  themeColor: '#0a0a0a',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  const jsonLd = [
    getOrganizationJsonLd(),
    getWebsiteJsonLd(),
    getSoftwareJsonLd(),
  ];

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
