"use client"

import { useRoleGuard } from "@/hooks/use-role-guard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

export function RoleGuard({ children, roles = [], permissions = [], requireAll = false, fallback = null }) {
  const { isAuthenticated, isAnyRole, checkAnyPermission, checkAllPermissions } = useRoleGuard()

  // Check authentication
  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert className="max-w-md">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>Please log in to access this content.</AlertDescription>
          </Alert>
        </div>
      )
    )
  }

  // Check roles
  if (roles.length > 0 && !isAnyRole(roles)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <Alert className="max-w-md" variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>You don't have the required role to access this content.</AlertDescription>
          </Alert>
        </div>
      )
    )
  }

  // Check permissions
  if (permissions.length > 0) {
    const hasAccess = requireAll ? checkAllPermissions(permissions) : checkAnyPermission(permissions)

    if (!hasAccess) {
      return (
        fallback || (
          <div className="flex items-center justify-center min-h-[400px]">
            <Alert className="max-w-md" variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>You don't have the required permissions to access this content.</AlertDescription>
            </Alert>
          </div>
        )
      )
    }
  }

  return <>{children}</>
}
