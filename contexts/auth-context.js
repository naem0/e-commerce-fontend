"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { useSession } from "next-auth/react"
import { hasPermission, hasAnyPermission, hasAllPermissions, getRolePermissions } from "@/lib/permissions"

// Initial state
const initialState = {
  user: null,
  role: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Action types
const AUTH_ACTIONS = {
  SET_USER: "SET_USER",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  LOGOUT: "LOGOUT",
}

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        permissions: action.payload.permissions,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
        error: null,
      }
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      }
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      return
    }

    if (session?.user) {
      const userRole = session.user.role?.toUpperCase() || "CUSTOMER"
      const userPermissions = getRolePermissions(userRole)

      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: {
          user: session.user,
          role: userRole,
          permissions: userPermissions,
        },
      })
    } else {
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
    }
  }, [session, status])

  // Helper functions
  const checkPermission = (permission) => {
    return hasPermission(state.role, permission)
  }

  const checkAnyPermission = (permissions) => {
    return hasAnyPermission(state.role, permissions)
  }

  const checkAllPermissions = (permissions) => {
    return hasAllPermissions(state.role, permissions)
  }

  const isRole = (role) => {
    return state.role === role.toUpperCase()
  }

  const isAnyRole = (roles) => {
    return roles.some((role) => state.role === role.toUpperCase())
  }

  const value = {
    ...state,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    isRole,
    isAnyRole,
    dispatch,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
