import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
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
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased font-sans`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
        {children}
      </body>
    </html>
  );
}

