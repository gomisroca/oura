import '@/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';

import { TRPCReactProvider } from '@/trpc/react';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'OURA Clothing',
  description: 'Eco-friendly sports clothing',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ThemeProvider attribute="class">
          <TRPCReactProvider>
            <div style={{ backgroundImage: "url('/bg.jpg')" }} className="bg-cover bg-fixed bg-center bg-no-repeat">
              <main className="min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-100/80 via-70% to-slate-100/20 text-neutral-800 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900/20 dark:text-neutral-200">
                {children}
              </main>
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
