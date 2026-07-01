import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});
export const metadata: Metadata = {
  title: {
    default: "localstorage-platform",
    template: "%s | localstorage-platform",
  },

  description:
    "A type-safe browser storage library with namespaces, metadata, TTL, optional encryption, and group-based cleanup.",

  applicationName: "localstorage-platform",

  keywords: [
    "localStorage",
    "storage",
    "typescript",
    "react",
    "nextjs",
    "cache",
    "frontend",
    "browser storage",
    "storage manager",
  ],

  authors: [
    {
      name: "captain",
    },
  ],

  creator: "captain",
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
