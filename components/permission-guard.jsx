"use client"

import { usePermissions } from "@/hooks/use-permissions"

export function PermissionGuard({ permission, permissions, requireAll = false, fallback = null, children }) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(permission)
  } else if (permissions && Array.isArray(permissions)) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions)
    } else {
      hasAccess = hasAnyPermission(permissions)
    }
  }

  if (!hasAccess) {
    return fallback
  }

  return children
}
