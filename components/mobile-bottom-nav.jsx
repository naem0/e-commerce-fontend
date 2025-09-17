'use client'

import Link from "next/link";
import { Home, ShoppingCart, Heart, User, LayoutGrid } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export default function MobileBottomNav() {
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        <Link href="/" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
          <Home className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom" />
          <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom">{t('nav.home')}</span>
        </Link>
        <Link href="/categories" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
          <LayoutGrid className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom" />
          <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom">{t('nav.categories')}</span>
        </Link>
        <Link href="/cart" className="relative inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
          <ShoppingCart className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom" />
          {cartItemCount > 0 && (
            <Badge variant="destructive" className="absolute top-1 right-3 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
              {cartItemCount}
            </Badge>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom">{t('nav.cart')}</span>
        </Link>
        <Link href="/wishlist" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
          <Heart className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom" />
          <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom">{t('nav.wishlist')}</span>
        </Link>
        {session ? (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div variant="ghost" className="inline-flex flex-col items-center justify-center px-5 group">
                  <User className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom">
                    {session.user.name}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/profile">
                  <DropdownMenuItem>{t('nav.profile')}</DropdownMenuItem>
                </Link>
                <Link href="/orders">
                  <DropdownMenuItem>{t('nav.orders')}</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>{t('auth.logout')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link href="/auth/login" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <User className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom" />
            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-custom dark:group-hover:text-primary-custom">{t('auth.login')}</span>
          </Link>
        )}
      </div>
    </div>
  );
}