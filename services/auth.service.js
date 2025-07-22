import { apiRequest } from "./api.utils"

class AuthService {
  async login(credentials) {
    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })

      if (response.success && response.token) {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
      }

      return response
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  async register(userData) {
    try {
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      })

      if (response.success && response.token) {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
      }

      return response
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  }

  async forgotPassword(email) {
    try {
      const response = await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      })

      return response
    } catch (error) {
      console.error("Forgot password error:", error)
      throw error
    }
  }

  async resetPassword(token, password) {
    try {
      const response = await apiRequest(`/api/auth/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({ password }),
      })

      return response
    } catch (error) {
      console.error("Reset password error:", error)
      throw error
    }
  }

  async verifyResetToken(token) {
    try {
      const response = await apiRequest(`/api/auth/verify-reset-token/${token}`, {
        method: "GET",
      })

      return response
    } catch (error) {
      console.error("Verify reset token error:", error)
      throw error
    }
  }

  async getProfile() {
    try {
      const response = await apiRequest("/api/auth/me", {
        method: "GET",
      })

      return response
    } catch (error) {
      console.error("Get profile error:", error)
      throw error
    }
  }

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/auth/login"
  }

  getCurrentUser() {
    try {
      const user = localStorage.getItem("user")
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  getToken() {
    return localStorage.getItem("token")
  }

  isAuthenticated() {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
