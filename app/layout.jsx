import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { SiteSettingsProvider } from "@/components/site-settings-provider"
import { CartProvider } from "@/components/cart-provider"
import { WishlistProvider } from "@/components/wishlist-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import WhatsAppButton from "@/components/whatsapp-button"
import { getSiteSettings } from "@/services/settings.service"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "E-Commerce Store",
  description: "Modern e-commerce solution with Next.js",
}

export default async function RootLayout({ children }) {
  const data = await getSiteSettings()
  const settings = data?.success ? data.settings : {}
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>
          {`
            :root {
              --primary-color: ${settings.primaryColor || "#22c55e"};
              --secondary-color: ${settings.secondaryColor || "#16a34a"};
            }
          `}
        </style>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
              <SiteSettingsProvider>
                <CartProvider>
                  <WishlistProvider>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">{children}</main>
                      <Footer />
                    </div>
                    <Toaster />
                    <WhatsAppButton />
                  </WishlistProvider>
                </CartProvider>
              </SiteSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
