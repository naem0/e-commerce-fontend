import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Register a new user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData)
    return response.data
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || "Registration failed",
    }
  }
}

// Login user
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials)

    // Store token and user data in localStorage
    if (typeof window !== "undefined" && response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return response.data
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || "Login failed",
    }
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
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (!token) {
      throw {
        success: false,
        message: "No token found",
      }
    }

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to get user data",
    }
  }
}

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email })
    return response.data
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to process forgot password request",
    }
  }
}

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password })
    return response.data
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to reset password",
    }
  }
}

// Verify email
export const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/verify-email/${token}`)
    return response.data
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to verify email",
    }
  }
}

// Resend verification email
export const resendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/resend-verification`, { email })
    return response.data
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to resend verification email",
    }
  }
}
