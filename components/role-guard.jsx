"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function RoleGuard({
  children,
  roles = [],
  permissions = [],
  requireAll = false,
  fallback = null,
  redirectTo = null,
}) {
  const { user, isAnyRole, checkPermission, checkAnyPermission, checkAllPermissions, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!user && redirectTo) {
      router.push(redirectTo)
    }
  }, [user, isLoading, redirectTo, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return fallback
  }

  // Check role requirements
  if (roles.length > 0) {
    const hasRole = isAnyRole(roles)
    if (!hasRole) {
      return fallback
    }
  }

  // Check permission requirements
  if (permissions.length > 0) {
    const hasPermissions = requireAll ? checkAllPermissions(permissions) : checkAnyPermission(permissions)

    if (!hasPermissions) {
      return fallback
    }
  }

  return children
}

// Higher-order component version
export function withRoleGuard(Component, options = {}) {
  return function RoleGuardedComponent(props) {
    return (
      <RoleGuard {...options}>
        <Component {...props} />
      </RoleGuard>
    )
  }
}
