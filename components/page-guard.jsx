"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

export function PageGuard({ children, roles = [], permissions = [], requireAll = false, redirectTo = "/" }) {
  const router = useRouter()
  const { isAuthenticated, isAnyRole, checkAnyPermission, checkAllPermissions } = useRoleGuard()

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    // Check roles
    if (roles.length > 0 && !isAnyRole(roles)) {
      router.push(redirectTo)
      return
    }

    // Check permissions
    if (permissions.length > 0) {
      const hasAccess = requireAll ? checkAllPermissions(permissions) : checkAnyPermission(permissions)
      if (!hasAccess) {
        router.push(redirectTo)
      }
    }
  }, [
    isAuthenticated,
    roles,
    permissions,
    requireAll,
    redirectTo,
    router,
    isAnyRole,
    checkAnyPermission,
    checkAllPermissions,
  ])

  // Show loading or access denied during check
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Check roles
  if (roles.length > 0 && !isAnyRole(roles)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-md" variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You don't have the required role to access this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Check permissions
  if (permissions.length > 0) {
    const hasAccess = requireAll ? checkAllPermissions(permissions) : checkAnyPermission(permissions)
    if (!hasAccess) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Alert className="max-w-md" variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>You don't have the required permissions to access this page.</AlertDescription>
          </Alert>
        </div>
      )
    }
  }

  return <>{children}</>
}
