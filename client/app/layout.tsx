'use client'

import { Golos_Text } from 'next/font/google'
import Footer from './components/Navigation/Footer'
import Navbar from './components/Navigation/Navbar'
import { UserProvider } from './contexts/UserContext'
import { SessionProvider } from "next-auth/react"
import useIsMobile from './hooks/useIsMobile'
import './index.css'

const golos = Golos_Text({
    subsets: ['latin'],
    display: 'swap',
    adjustFontFallback: false,
})

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const isMobile = useIsMobile();
    return (
        <html lang="en" className={golos.className}>
            <head>
                <title>OURA</title>
                <meta name="description" content="Thoughtful Clothing" />
            </head>
            <body>
                <SessionProvider>
                    <UserProvider>
                        <div className="absolute top-0 flex flex-col bg-gradient-to-br from-zinc-200 via-zinc-200 to-zinc-300 w-full min-h-full">
                            <div className="absolute top-0 w-full left-0 z-10">
                                <Navbar />
                            </div>
                            <div className="absolute flex items-center justify-center">
                                {children}
                            </div>
                            {!isMobile ?            
                            <div className="absolute bottom-0 w-full left-0 z-10">
                                <Footer />
                            </div>
                            : null}
                        </div>
                    </UserProvider>
                </SessionProvider>
            </body>
        </html>

    )
}