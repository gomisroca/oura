import '@/styles/globals.css';

import { Work_Sans } from 'next/font/google';
import { type Metadata } from 'next';

import { TRPCReactProvider } from '@/trpc/react';
import { ThemeProvider } from 'next-themes';
import Navbar from './_components/navbar';

export const metadata: Metadata = {
  title: 'OURA Clothing',
  description: 'Eco-friendly sports clothing',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const worksans = Work_Sans({
  subsets: ['latin'],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={worksans.className}>
      <body>
        <ThemeProvider attribute="class">
          <TRPCReactProvider>
            <div style={{ backgroundImage: "url('/bg.jpg')" }} className="bg-cover bg-fixed bg-center bg-no-repeat">
              <Navbar />
              <main className="flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-200/90 to-slate-800/40 px-4 pb-10 pt-20 text-slate-800 dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-900/60 dark:text-slate-200 xl:px-32">
                {children}
              </main>
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
