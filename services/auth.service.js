import { createAPI, handleError } from "./api.utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

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
