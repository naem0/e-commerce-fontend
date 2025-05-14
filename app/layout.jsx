import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { LanguageProvider } from "@/components/language-provider"
import { AuthProvider } from "@/components/auth-provider"
import { SiteSettingsProvider } from "@/components/site-settings-provider"
import { CartProvider } from "@/components/cart-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "E-Commerce Solution",
  description: "A complete e-commerce solution",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <SiteSettingsProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <CartProvider>
                  <Header />
                  {children}
                  <Footer />
                </CartProvider>
              </ThemeProvider>
            </SiteSettingsProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
