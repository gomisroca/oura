import '@/styles/globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Provider as JotaiProvider } from 'jotai';
import { type Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import { TRPCReactProvider } from '@/trpc/react';

import Navbar from './_components/navbar';

export const metadata: Metadata = {
  title: 'OURA Clothing',
  description: 'Eco-friendly sports clothing',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

const worksans = Work_Sans({ subsets: ['latin'], weight: ['400', '600'] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={worksans.className} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">
          <JotaiProvider>
            <TRPCReactProvider>
              <div
                style={{ backgroundImage: "url('/bg.jpg')" }}
                className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat">
                <Navbar />
                <main
                  role="main"
                  className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-400/40 via-white to-sky-400/40 px-4 pt-20 pb-10 text-neutral-800 xl:px-32 dark:from-pink-600/40 dark:via-black dark:to-sky-600/40 dark:text-neutral-200">
                  {children}
                </main>
              </div>
            </TRPCReactProvider>
          </JotaiProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
