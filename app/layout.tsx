import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

// TODO: Create public/og-image.png (1200x630px, dark bg, Cadence. logo + tagline)
export const metadata: Metadata = {
  title: 'Cadence OS — Career Pipeline OS',
  description: 'Cadence OS is the career pipeline operating system for serious job seekers. Track contacts, manage follow-ups, and never let a warm lead go cold.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: 'https://cadenceos.app/',
    siteName: 'Cadence OS',
    title: 'Cadence OS — Career Pipeline OS',
    description: 'Track your network. Manage follow-ups. Never let a warm lead go cold.',
    images: [{ url: 'https://cadenceos.app/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cadence OS — Career Pipeline OS',
    description: 'Track your network. Manage follow-ups. Never let a warm lead go cold.',
    images: ['https://cadenceos.app/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("h-full", geist.variable)}>
      <body className="min-h-full bg-surface-base text-text-primary antialiased">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
