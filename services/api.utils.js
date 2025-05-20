import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to get auth header
export const getAuthHeader = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
  }
  return {}
}

// Create a base API instance
export const createAPI = (endpoint) => {
  const api = axios.create({
    baseURL: `${API_URL}/${endpoint}`,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // Add auth token to requests
  api.interceptors.request.use(
    (config) => {
      const authHeader = getAuthHeader()
      if (authHeader) {
        config.headers = {
          ...config.headers,
          ...authHeader,
        }
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  return api
}

// Helper function to handle errors
export const handleError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.message || "An error occurred",
    }
  } else if (error.request) {
    return {
      status: 503,
      message: "Server not responding. Please try again later.",
    }
  } else {
    return {
      status: 500,
      message: error.message || "An unexpected error occurred",
    }
  }
}
