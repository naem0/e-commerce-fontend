import { createAPI, handleError } from "./api.utils"

// Create auth API instance
const authAPI = createAPI("auth")

// Register a new user
export const register = async (userData) => {
  try {
    const response = await authAPI.post("/register", userData)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Login user
export const login = async (credentials) => {
  try {
    const response = await authAPI.post("/login", credentials)

    // Store token and user data in localStorage
    if (typeof window !== "undefined" && response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Logout user
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return { success: true }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await authAPI.get("/me")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await authAPI.post("/forgot-password", { email })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await authAPI.post(`/reset-password/${token}`, { password })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Verify email
export const verifyEmail = async (token) => {
  try {
    const response = await authAPI.get(`/verify-email/${token}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Resend verification email
export const resendVerificationEmail = async (email) => {
  try {
    const response = await authAPI.post("/resend-verification", { email })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}
