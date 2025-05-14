import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  const isAdmin = token?.role === "admin"
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  // Redirect unauthenticated users to login
  if (!isAuthenticated && (isAdminRoute || request.nextUrl.pathname.startsWith("/account"))) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect non-admin users trying to access admin routes
  if (isAuthenticated && isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
}
