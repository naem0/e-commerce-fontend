"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PageGuard({ children, roles = [], permissions = [], requireAll = false, showFallback = true }) {
  const { user, role, isAnyRole, checkAnyPermission, checkAllPermissions, isLoading } = useAuth()
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (isLoading) return

    // Check authentication
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Check role requirements
    let roleCheck = true
    if (roles.length > 0) {
      roleCheck = isAnyRole(roles)
    }

    // Check permission requirements
    let permissionCheck = true
    if (permissions.length > 0) {
      permissionCheck = requireAll ? checkAllPermissions(permissions) : checkAnyPermission(permissions)
    }

    const access = roleCheck && permissionCheck
    setHasAccess(access)

    if (!access && showFallback) {
      // Don't redirect, just show access denied
      return
    }

    if (!access && !showFallback) {
      router.push("/")
    }
  }, [
    user,
    role,
    isLoading,
    roles,
    permissions,
    requireAll,
    showFallback,
    router,
    isAnyRole,
    checkAnyPermission,
    checkAllPermissions,
  ])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <Lock className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Authentication Required</h2>
            <p className="text-muted-foreground text-center">You need to be logged in to access this page.</p>
            <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasAccess && showFallback) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground text-center">You don't have permission to access this page.</p>
            <div className="text-sm text-muted-foreground">
              <p>
                Your role: <span className="font-medium">{role}</span>
              </p>
              {roles.length > 0 && (
                <p>
                  Required roles: <span className="font-medium">{roles.join(", ")}</span>
                </p>
              )}
              {permissions.length > 0 && (
                <p>
                  Required permissions: <span className="font-medium">{permissions.join(", ")}</span>
                </p>
              )}
            </div>
            <Button onClick={() => router.push("/")} variant="outline">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return children
}
