import type { Metadata } from "next";
import "./globals.css";
import { DM_Serif_Display, DM_Mono, DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-dm-serif', display: 'swap' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-dm-sans', display: 'swap' });

const BASE_URL = 'https://cadenceos.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Cadence OS — Job Search CRM for Serious Job Seekers',
    template: '%s — Cadence OS',
  },
  description: 'Cadence OS is the job search CRM for serious job seekers. Track contacts, manage follow-ups, and never let a warm lead go cold. Pipeline tracking, relationship management, and smart reminders — all in one place.',
  keywords: [
    'job search CRM', 'job search tracker', 'career pipeline', 'job application tracker',
    'networking tracker', 'follow-up reminder', 'relationship management job search',
    'job hunt organizer', 'career OS', 'job pipeline tool',
  ],
  authors: [{ name: 'Cadence OS', url: BASE_URL }],
  creator: 'Cadence OS',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: {
    canonical: BASE_URL,
    types: { 'text/plain': `${BASE_URL}/llms.txt` },
  },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'Cadence OS',
    title: 'Cadence OS — Job Search CRM for Serious Job Seekers',
    description: 'Track your network. Manage follow-ups. Never let a warm lead go cold. The job search CRM built for people who treat the hunt like a pipeline.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Cadence OS — Job Search CRM' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cadence OS — Job Search CRM',
    description: 'Track your network. Manage follow-ups. Never let a warm lead go cold.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : null

  return (
    <html lang="en" className={cn("h-full", dmSans.variable, dmSerif.variable, dmMono.variable)}>
      <head>
        {supabaseHostname && (
          <>
            <link rel="preconnect" href={`https://${supabaseHostname}`} />
            <link rel="dns-prefetch" href={`https://${supabaseHostname}`} />
          </>
        )}
      </head>
      <body className="min-h-full bg-surface-base text-text-primary antialiased">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
