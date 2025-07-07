import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Get auth headers with token
export const getAuthHeaders = async () => {
  try {
    // Try to get session
    const session = await getSession()

    if (session?.accessToken) {
      return {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      }
    }

    // Fallback: try localStorage
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken")
      if (storedToken) {
        return {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        }
      }
    }

    return {
      "Content-Type": "application/json",
    }
  } catch (error) {
    console.error("Error getting auth headers:", error)
    return {
      "Content-Type": "application/json",
    }
  }
}

// API request helper
export const apiRequest = async (url, options = {}) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Create API instance for specific endpoints
export const createAPI = (endpoint) => {
  const baseURL = `${API_URL}/api/${endpoint}`

  return {
    get: async (path = "", options = {}) => {
      return apiRequest(`${baseURL}${path}`, {
        method: "GET",
        ...options,
      })
    },
    post: async (path = "", data = null, options = {}) => {
      return apiRequest(`${baseURL}${path}`, {
        method: "POST",
        body: data ? JSON.stringify(data) : null,
        ...options,
      })
    },
    put: async (path = "", data = null, options = {}) => {
      return apiRequest(`${baseURL}${path}`, {
        method: "PUT",
        body: data ? JSON.stringify(data) : null,
        ...options,
      })
    },
    delete: async (path = "", options = {}) => {
      return apiRequest(`${baseURL}${path}`, {
        method: "DELETE",
        ...options,
      })
    },
  }
}

// Handle API errors
export const handleError = (error) => {
  if (error.response) {
    return {
      success: false,
      status: error.response.status,
      message: error.response.data?.message || "An error occurred",
    }
  } else if (error.request) {
    return {
      success: false,
      status: 503,
      message: "Server not responding. Please try again later.",
    }
  } else {
    return {
      success: false,
      status: 500,
      message: error.message || "An unexpected error occurred",
    }
  }
}
