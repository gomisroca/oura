import { Urbanist } from 'next/font/google'
import Footer from '@/components/navigation/footer'
import Navbar from '@/components/navigation/navbar'
import { UserProvider } from '@/contexts/user'
import './index.css'
import { Metadata } from 'next'

const urbanist = Urbanist({
    subsets: ['latin'],
    display: 'swap',
    weight: '600'
})

export const metadata: Metadata = {
    title: "OURA",
    description: "Thoughtful Clothing",
};

export default function RootLayout({
    children
}) {
    return (
        <html lang="en" className={urbanist.className}>
            <body>
                <UserProvider>
                    <div className="absolute top-0 flex flex-col bg-gradient-to-br from-zinc-200 via-zinc-200 to-zinc-300 w-full min-h-full">
                        <div className="absolute top-0 w-full left-0 z-10">
                            <Navbar />
                        </div>
                        <div className="relative mt-[1.40rem] md:mt-7 flex items-center justify-center">
                            {children}
                        </div>        
                        <div className="absolute bottom-0 w-full left-0 z-10">
                            <Footer />
                        </div>
                    </div>
                </UserProvider>
            </body>
        </html>
    )
}