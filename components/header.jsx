"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { useSiteSettings } from "@/components/site-settings-provider"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart, User, Sun, Moon, Globe, Search, Heart, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { settings } = useSiteSettings()
  const { getCartItemCount } = useCart()
  const { getWishlistCount } = useWishlist()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const cartItemCount = getCartItemCount()
  const wishlistCount = getWishlistCount()

  const isActive = (path) => {
    return pathname === path
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            {settings?.logo ? (
              <Image
                src={settings.logo || "/placeholder.svg"}
                alt={settings.siteName}
                width={40}
                height={40}
                className="h-8 w-auto"
              />
            ) : (
              <span className="font-bold text-xl" style={{ color: settings?.primaryColor }}>
                {settings?.siteName || "E-Shop"}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary-custom ${isActive("/") ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              {t("nav.home") || "Home"}
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors hover:text-primary-custom ${isActive("/products") ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              {t("nav.products") || "Products"}
            </Link>
            <Link
              href="/categories"
              className={`text-sm font-medium transition-colors hover:text-primary-custom ${isActive("/categories") ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              {t("nav.categories") || "Categories"}
            </Link>
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center ml-6">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t("nav.searchPlaceholder") || "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-10"
              />
              <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>

          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("bn")}>বাংলা</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Wishlist */}
          {session && (
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                  >
                    {wishlistCount}
                  </Badge>
                )}
                <span className="sr-only">{t("nav.wishlist") || "Wishlist"}</span>
              </Button>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                >
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">{t("nav.cart") || "Cart"}</span>
            </Button>
          </Link>

          {/* User Account */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t("nav.account") || "Account"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/profile">
                  <DropdownMenuItem>
                    {t("nav.profile") || "Profile"}
                  </DropdownMenuItem>
                </Link>
                <Link href="/orders">
                  <DropdownMenuItem>
                    {t("nav.orders") || "Orders"}
                  </DropdownMenuItem>
                </Link>
                <Link href="/wishlist">
                  <DropdownMenuItem>
                    {t("nav.wishlist") || "Wishlist"}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>{t("auth.logout") || "Logout"}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline">{t("auth.login") || "Login"}</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t("nav.searchPlaceholder") || "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                {t("nav.home") || "Home"}
              </Link>
              <Link href="/products" className="text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                {t("nav.products") || "Products"}
              </Link>
              <Link href="/categories" className="text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                {t("nav.categories") || "Categories"}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
