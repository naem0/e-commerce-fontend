"use client"

import { useSession } from "next-auth/react"
import { hasPermission, hasAnyPermission, hasAllPermissions, getRolePermissions } from "@/lib/permissions"

export function usePermissions() {
  const { data: session } = useSession()
  const userRole = session?.user?.role

  return {
    hasPermission: (permission) => hasPermission(userRole, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(userRole, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(userRole, permissions),
    getRolePermissions: () => getRolePermissions(userRole),
    userRole,
    user: session?.user,
  }
}
