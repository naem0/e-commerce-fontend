import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Helper function to get auth headers for JSON
const getAuthHeaders = async () => {
  try {
    const session = await getSession()

    let token = null

    // Get token from session
    if (session?.accessToken) {
      token = session.accessToken
    }
    // Fallback: get from localStorage
    else if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
    }

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    } else {
      return {
        "Content-Type": "application/json",
      }
    }
  } catch (error) {
    return {
      "Content-Type": "application/json",
    }
  }
}

// Login user
export const login = async (credentials) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/auth/login`

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Register user
export const register = async (userData) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/auth/register`

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/auth/forgot-password`

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/auth/reset-password/${token}`

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ password: newPassword }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Verify reset token
export const verifyResetToken = async (token) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/auth/verify-reset-token/${token}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/auth/me`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Update profile
export const updateProfile = async (userData) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/auth/update-profile`

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Change password
export const changePassword = async (passwordData) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/auth/change-password`

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(passwordData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Logout
export const logout = async () => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/auth/logout`

    const response = await fetch(url, {
      method: "POST",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Export as default object for backward compatibility
export const authService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout,
}

export default authService
