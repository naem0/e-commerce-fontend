"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, BarChart, LogOut, Menu, X, Tag, Tags, GalleryHorizontal, Layers, MonitorCog, Barcode } from "lucide-react"

export function AdminLayout({ children }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (path) => {
    return pathname === path
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      current: isActive("/admin/dashboard"),
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
      current: isActive("/admin/products"),
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Layers,
      current: isActive("/admin/categories"),
    },
    {
      name: "Brands",
      href: "/admin/brands",
      icon: Tag,
      current: isActive("/admin/brands"),
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      current: isActive("/admin/orders"),
    },
    {
      name: "Reviews",
      href: "/admin/reviews",
      icon: Tags,
      current: isActive("/admin/reviews"),
    },
    {
      name: "Purchases",
      href: "/admin/inventory/purchases",
      icon: ShoppingBag,
      current: isActive("/admin/inventory/purchases"),
    },
    {
      name: "Inventory",
      href: "/admin/inventory",
      icon: Package,
      current: isActive("/admin/inventory"),
    },
    {
      name: "POS",
      href: "/admin/pos",
      icon: Barcode,
      current: isActive("/admin/pos"),
    },
    {
      name: "Customers",
      href: "/admin/users",
      icon: Users,
      current: isActive("/admin/users"),
    },
    {
      name: "Banners",
      href: "/admin/banners",
      icon: GalleryHorizontal,
      current: isActive("/admin/banners"),
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart,
      current: isActive("/admin/analytics"),
    },
    {
      name: "Home Settings",
      href: "/admin/home-settings",
      icon: MonitorCog,
      current: isActive("/admin/home-settings"),
    },
    {
      name: "Settings",
      href: "/admin/site-settings",
      icon: Settings,
      current: isActive("/admin/site-settings"),
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <div className="flex flex-col h-[calc(100%-4rem)] justify-between">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-custom text-primary-foreground flex items-center justify-center">
                  {session?.user?.name?.charAt(0) || "A"}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{session?.user?.name || "Admin User"}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.email || "admin@example.com"}</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start mt-4">
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-background border-b h-16 flex items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold">E-Commerce Admin</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
