import type { Metadata } from "next";
import "./globals.css";
import { DM_Serif_Display, DM_Mono, DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-dm-serif' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-dm-sans' });

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
    <html lang="en" className={cn("h-full", dmSans.variable, dmSerif.variable, dmMono.variable)}>
      <body className="min-h-full bg-surface-base text-text-primary antialiased">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
