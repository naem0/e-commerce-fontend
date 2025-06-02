import axios from "axios"
import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    console.log("Getting session...")

    // Try to get client-side session first
    const clientSession = await getSession()

    if (clientSession?.accessToken) {
      console.log("Using client-side session token")
      return {
        Authorization: `Bearer ${clientSession.accessToken}`,
      }
    }

    // Fallback: try to get token from localStorage (if stored there)
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken")
      if (storedToken) {
        console.log("Using token from localStorage")
        return {
          Authorization: `Bearer ${storedToken}`,
        }
      }

      // Try to get token from user object in localStorage
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          if (user?.token) {
            console.log("Using token from localStorage user object")
            return {
              Authorization: `Bearer ${user.token}`,
            }
          }
        } catch (e) {
          console.error("Error parsing user from localStorage:", e)
        }
      }
    }

    console.log("No authentication token found")
    return {}
  } catch (error) {
    console.error("Error getting session:", error)
    return {}
  }
}

// Get site settings
export const getSiteSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/site-settings`)
    return {
      success: true,
      settings: response.data.settings,
    }
  } catch (error) {
    console.error("Get site settings error:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch settings",
    }
  }
}

// Update site settings (admin only)
export const updateSiteSettings = async (settings) => {
  try {
    console.log("=== UPDATE SITE SETTINGS ===")
    const authHeaders = await getAuthHeaders()
    console.log("Auth headers:", authHeaders)

    // Manual token handling for testing
    const token = localStorage.getItem("authToken") || localStorage.getItem("token")
    if (token && !authHeaders.Authorization) {
      console.log("Using manually stored token")
      authHeaders.Authorization = `Bearer ${token}`
    }

    if (!authHeaders.Authorization) {
      throw new Error("No authentication token available. Please login again.")
    }

    console.log("Sending request to:", `${API_URL}/site-settings`)
    console.log("Settings data keys:", Object.keys(settings))

    const response = await axios.put(`${API_URL}/site-settings`, settings, {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
    })

    console.log("Update response:", response.status, response.statusText)

    return {
      success: true,
      settings: response.data.settings,
      message: response.data.message,
    }
  } catch (error) {
    console.error("Update site settings error:", error)
    console.error("Error response:", error.response?.data)
    console.error("Error status:", error.response?.status)

    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update settings",
      status: error.response?.status,
    }
  }
}

// Update site settings with file upload
export const updateSiteSettingsWithFiles = async (formData) => {
  try {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders.Authorization) {
      throw new Error("No authentication token available. Please login again.")
    }

    const response = await axios.put(`${API_URL}/site-settings`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...authHeaders,
      },
    })

    return {
      success: true,
      settings: response.data.settings,
      message: response.data.message,
    }
  } catch (error) {
    console.error("Update site settings with files error:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update settings",
      status: error.response?.status,
    }
  }
}
