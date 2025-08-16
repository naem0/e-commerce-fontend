"use client"

import { usePermissions } from "@/hooks/use-permissions"

export function PermissionGuard({ permission, permissions, requireAll = false, fallback = null, children }) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  // Single permission check
  if (permission) {
    if (!hasPermission(permission)) {
      return fallback
    }
  }

  // Multiple permissions check
  if (permissions && Array.isArray(permissions)) {
    const hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions)

    if (!hasAccess) {
      return fallback
    }
  }

  return children
}

// Higher-order component version
export function withPermission(Component, permission, fallback = null) {
  return function PermissionWrappedComponent(props) {
    return (
      <PermissionGuard permission={permission} fallback={fallback}>
        <Component {...props} />
      </PermissionGuard>
    )
  }
}
