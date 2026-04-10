import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Cadence — Career pipeline OS",
  description: "Track contacts, move opportunities forward, and never lose momentum.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("dark h-full", geist.variable)}>
      <body className="min-h-full bg-[#09090E] text-[#EDEDF2] antialiased">
        {children}
      </body>
    </html>
  );
}
