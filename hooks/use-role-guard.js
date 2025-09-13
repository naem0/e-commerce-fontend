"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useRoleGuard(requiredRoles = [], requiredPermissions = [], redirectTo = "/") {
  const { user, role, checkPermission, checkAnyPermission, isAnyRole, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    // Check if user is authenticated
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Check role requirements
    if (requiredRoles.length > 0 && !isAnyRole(requiredRoles)) {
      router.push(redirectTo)
      return
    }

    // Check permission requirements
    if (requiredPermissions.length > 0 && !checkAnyPermission(requiredPermissions)) {
      router.push(redirectTo)
      return
    }
  }, [user, role, isLoading, requiredRoles, requiredPermissions, redirectTo, router, isAnyRole, checkAnyPermission])

  return {
    isLoading,
    hasAccess:
      user &&
      (requiredRoles.length === 0 || isAnyRole(requiredRoles)) &&
      (requiredPermissions.length === 0 || checkAnyPermission(requiredPermissions)),
  }
}
