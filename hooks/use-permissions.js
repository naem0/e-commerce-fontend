"use client"

import { useSession } from "next-auth/react"
import { hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions"

export function usePermissions() {
  const { data: session } = useSession()

  const userRole = session?.user?.role

  const checkPermission = (permission) => {
    return hasPermission(userRole, permission)
  }

  const checkAnyPermission = (permissions) => {
    return hasAnyPermission(userRole, permissions)
  }

  const checkAllPermissions = (permissions) => {
    return hasAllPermissions(userRole, permissions)
  }

  return {
    userRole,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
  }
}
