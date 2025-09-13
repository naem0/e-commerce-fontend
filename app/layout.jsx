import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider as NextAuthProvider } from "@/components/auth-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/components/language-provider"
import { SiteSettingsProvider } from "@/components/site-settings-provider"
import { CartProvider } from "@/components/cart-provider"
import { WishlistProvider } from "@/components/wishlist-provider"
import { Toaster } from "@/components/ui/toaster"
import WhatsAppButton from "@/components/whatsapp-button"
import { getSiteSettings } from "@/services/settings.service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "E-Commerce Store",
  description: "Modern e-commerce solution with Next.js",
}

export default async function RootLayout({ children }) {
  const data = await getSiteSettings()
  const settings = data?.success ? data.settings : {}
  const session = await getServerSession(authOptions)
  const user = session?.user || null

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
          <NextAuthProvider session={session} user={user}>
          <AuthProvider>
            <LanguageProvider>
              <SiteSettingsProvider>
                <CartProvider>
                  <WishlistProvider>
                    <div className="min-h-screen flex flex-col">
                      <main className="flex-1">{children}</main>
                    </div>
                    <Toaster />
                    <WhatsAppButton />
                  </WishlistProvider>
                </CartProvider>
              </SiteSettingsProvider>
            </LanguageProvider>
          </AuthProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}