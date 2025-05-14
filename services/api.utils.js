import axios from "axios"
import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create a base axios instance
export const createAPI = (baseEndpoint) => {
  const api = axios.create({
    baseURL: `${API_URL}/${baseEndpoint}`,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // Add request interceptor to include auth token
  api.interceptors.request.use(
    async (config) => {
      if (typeof window !== "undefined") {
        const session = await getSession()
        if (session?.user?.token) {
          config.headers.Authorization = `Bearer ${session.user.token}`
        }
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  return api
}

// Helper function to handle errors
export function handleError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      status: error.response.status,
      message: error.response.data.message || "An error occurred",
    }
  } else if (error.request) {
    // The request was made but no response was received
    return {
      status: 503,
      message: "Server not responding. Please try again later.",
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: 500,
      message: error.message || "An unexpected error occurred",
    }
  }
}
