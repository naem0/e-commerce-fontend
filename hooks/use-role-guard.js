"use client"

import { useAuth } from "@/contexts/auth-context"
import { hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions"

export function useRoleGuard() {
  const { user, role, permissions, isAuthenticated } = useAuth()

  const checkPermission = (permission) => {
    if (!isAuthenticated || !role) return false
    return hasPermission(role, permission)
  }

  const checkAnyPermission = (permissionList) => {
    if (!isAuthenticated || !role) return false
    return hasAnyPermission(role, permissionList)
  }

  const checkAllPermissions = (permissionList) => {
    if (!isAuthenticated || !role) return false
    return hasAllPermissions(role, permissionList)
  }

  const isRole = (roleName) => {
    if (!isAuthenticated || !role) return false
    return role === roleName.toUpperCase()
  }

  const isAnyRole = (roleNames) => {
    if (!isAuthenticated || !role) return false
    return roleNames.some((r) => role === r.toUpperCase())
  }

  const isMinRole = (minRole) => {
    if (!isAuthenticated || !role) return false
    const roleHierarchy = {
      SUPER_ADMIN: 100,
      ADMIN: 90,
      MANAGER: 80,
      EMPLOYEE: 70,
      CASHIER: 60,
      CUSTOMER: 50,
    }
    const userLevel = roleHierarchy[role] || 0
    const minLevel = roleHierarchy[minRole.toUpperCase()] || 0
    return userLevel >= minLevel
  }

  return {
    user,
    role,
    permissions,
    isAuthenticated,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    isRole,
    isAnyRole,
    isMinRole,
  }
}
