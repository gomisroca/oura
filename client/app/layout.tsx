import { Urbanist } from 'next/font/google'
import Footer from '@/components/navigation/footer'
import Navbar from '@/components/navigation/navbar'
import { UserProvider } from '@/contexts/user'
import './globals.css'
import { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import bg from '@/public/images/bg.jpg'
import { CartProvider } from '@/contexts/cart'


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
        <html lang="en" className={urbanist.className} suppressHydrationWarning>
            <body style={{backgroundImage: `url(${bg.src})`}}>
                <UserProvider>
                    <CartProvider>
                        <div className="flex flex-col min-h-screen top-0 bg-gradient-to-br  from-zinc-200/95 via-zinc-200/95 to-zinc-300/90 w-full">
                            <div className="absolute w-full left-0 z-10">
                                <Navbar />
                            </div>
                            <div className="flex-1 flex">
                                {children}
                            </div>        
                            <div className="w-full left-0 z-10">
                                <Footer />
                            </div>
                        </div>
                    <Toaster />
                    </CartProvider>
                </UserProvider>
            </body>
        </html>
    )
}