import type { Metadata } from 'next';
import { Open_Sans, Geist_Mono } from 'next/font/google';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import './globals.css';

config.autoAddCss = false;

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MeghSetu | India Meteorological Department (IMD)',
  description:
    'MeghSetu — Centralized Digital Learning Management and Organizational Capacity Building Portal for the India Meteorological Department (IMD) - Ministry of Earth Sciences, Government of India.',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${geistMono.variable} h-full antialiased font-sans`}>
      <body className="min-h-full flex flex-col bg-[#ffffff] text-[#0f1419] selection:bg-[#e3ecf6] selection:text-[#1e9df1] font-sans">
        {children}
      </body>
    </html>
  );
}

