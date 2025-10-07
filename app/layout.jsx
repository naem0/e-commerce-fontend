import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { SiteSettingsProvider } from "@/components/site-settings-provider";
import { CartProvider } from "@/components/cart-provider";
import { WishlistProvider } from "@/components/wishlist-provider";
import { Toaster } from "@/components/ui/toaster";
import { getSiteSettings } from "@/services/settings.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const data = await getSiteSettings();
const settings = data?.success ? data.settings : {};

export const metadata = {
  title: settings?.siteName || "E-Commerce Solution",
  description:
    settings?.metaTags?.description ||
    "an e-commerce solution built with MERN stack",
};

export default async function RootLayout({ children }) {
  const data = await getSiteSettings();
  const settings = data?.success ? data.settings : {};
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <style>
          {`
            :root {
              --primary-color: ${settings?.primaryColor || "#f7733b"};
              --secondary-color: ${settings?.secondaryColor || "#f7733b"};
            }
          `}
        </style>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider session={session}>
            <SiteSettingsProvider initialSettings={settings}>
              <CartProvider>
                <WishlistProvider>
                  {children}
                  <Toaster />
                </WishlistProvider>
              </CartProvider>
            </SiteSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}