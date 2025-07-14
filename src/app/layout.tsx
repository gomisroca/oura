import '@/styles/globals.css';

import { Work_Sans } from 'next/font/google';
import { type Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import { TRPCReactProvider } from '@/trpc/react';
import { ThemeProvider } from 'next-themes';
import { Provider as JotaiProvider } from 'jotai';
import Navbar from './_components/navbar';

export const metadata: Metadata = {
  title: 'OURA Clothing',
  description: 'Eco-friendly sports clothing',
  icons: {
    icon: '/favicon.ico',
  },
};

const worksans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600'], // Add specific weights if needed
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={worksans.className}>
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
                  className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-slate-200/90 to-slate-800/40 px-4 pt-20 pb-10 text-slate-800 xl:px-32 dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-900/60 dark:text-slate-200">
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
