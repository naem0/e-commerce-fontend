import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Define protected routes and their required roles/permissions
const protectedRoutes = {
  "/admin": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["view_dashboard"],
  },
  "/admin/dashboard": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["view_dashboard"],
  },
  "/admin/products": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["view_products"],
  },
  "/admin/products/create": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["create_products"],
  },
  "/admin/products/edit": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["edit_products"],
  },
  "/admin/categories": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["manage_product_categories"],
  },
  "/admin/brands": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["manage_product_brands"],
  },
  "/admin/orders": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["view_orders"],
  },
  "/admin/users": {
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["view_users"],
  },
  "/admin/roles": {
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["manage_roles"],
  },
  "/admin/suppliers": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["view_suppliers"],
  },
  "/admin/inventory": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["view_inventory"],
  },
  "/admin/pos": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE", "CASHIER"],
    permissions: ["access_pos"],
  },
  "/admin/analytics": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["view_analytics"],
  },
  "/admin/site-settings": {
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["manage_site_settings"],
  },
  "/admin/home-settings": {
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["manage_home_settings"],
  },
  "/admin/banners": {
    roles: ["SUPER_ADMIN", "ADMIN"],
    permissions: ["manage_banners"],
  },
  "/admin/reviews": {
    roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    permissions: ["view_reviews"],
  },
}

// Role hierarchy for permission checking
const roleHierarchy = {
  SUPER_ADMIN: ["*"], // All permissions
  ADMIN: [
    "view_dashboard",
    "view_products",
    "create_products",
    "edit_products",
    "delete_products",
    "manage_product_categories",
    "manage_product_brands",
    "view_orders",
    "create_orders",
    "edit_orders",
    "process_orders",
    "view_users",
    "create_users",
    "edit_users",
    "view_inventory",
    "manage_inventory",
    "view_suppliers",
    "manage_suppliers",
    "access_pos",
    "process_sales",
    "view_reports",
    "view_analytics",
    "export_data",
    "manage_site_settings",
    "manage_banners",
    "manage_home_settings",
    "view_reviews",
    "moderate_reviews",
    "manage_roles",
  ],
  MANAGER: [
    "view_dashboard",
    "view_products",
    "create_products",
    "edit_products",
    "view_orders",
    "edit_orders",
    "process_orders",
    "view_users",
    "view_inventory",
    "manage_inventory",
    "view_suppliers",
    "access_pos",
    "process_sales",
    "manage_cash_register",
    "view_reports",
    "view_analytics",
    "view_reviews",
    "moderate_reviews",
  ],
  EMPLOYEE: [
    "view_dashboard",
    "view_products",
    "view_orders",
    "view_inventory",
    "access_pos",
    "process_sales",
    "view_reviews",
  ],
  CASHIER: ["access_pos", "process_sales", "view_products", "view_inventory"],
  CUSTOMER: [],
}

function hasPermission(userRole, permission) {
  const permissions = roleHierarchy[userRole?.toUpperCase()] || []
  return permissions.includes("*") || permissions.includes(permission)
}

function hasAnyRole(userRole, allowedRoles) {
  return allowedRoles.includes(userRole?.toUpperCase())
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Check if the route is protected
    const routeConfig = Object.keys(protectedRoutes).find((route) => pathname.startsWith(route))

    if (routeConfig) {
      const config = protectedRoutes[routeConfig]
      const userRole = token?.role?.toUpperCase()

      // Check role requirements
      if (config.roles && config.roles.length > 0) {
        if (!hasAnyRole(userRole, config.roles)) {
          return NextResponse.redirect(new URL("/auth/login", req.url))
        }
      }

      // Check permission requirements
      if (config.permissions && config.permissions.length > 0) {
        const hasRequiredPermission = config.permissions.some((permission) => hasPermission(userRole, permission))

        if (!hasRequiredPermission) {
          return NextResponse.redirect(new URL("/", req.url))
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow public routes
        if (
          pathname.startsWith("/auth") ||
          pathname === "/" ||
          pathname.startsWith("/products") ||
          pathname.startsWith("/categories")
        ) {
          return true
        }

        // Require authentication for protected routes
        if (pathname.startsWith("/admin") || pathname.startsWith("/profile") || pathname.startsWith("/orders")) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*", "/cart/:path*", "/checkout/:path*"],
}
