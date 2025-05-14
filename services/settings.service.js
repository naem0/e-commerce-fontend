import axios from "axios"
import { getAuthHeader } from "./utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance for site settings
const settingsAPI = axios.create({
  baseURL: `${API_URL}/site-settings`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
settingsAPI.interceptors.request.use(
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

// Get site settings
export const getSiteSettings = async () => {
  try {
    const response = await settingsAPI.get("/")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update site settings (admin only)
export const updateSiteSettings = async (settingsData) => {
  try {
    // Create FormData for file uploads
    const formData = new FormData()

    // Append text fields
    Object.keys(settingsData).forEach((key) => {
      if (key !== "logo" && key !== "favicon") {
        if (typeof settingsData[key] === "object") {
          formData.append(key, JSON.stringify(settingsData[key]))
        } else {
          formData.append(key, settingsData[key])
        }
      }
    })

    // Append logo if exists
    if (settingsData.logo) {
      formData.append("logo", settingsData.logo)
    }

    // Append favicon if exists
    if (settingsData.favicon) {
      formData.append("favicon", settingsData.favicon)
    }

    const response = await axios.put(`${API_URL}/site-settings`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Helper function to handle errors
function handleError(error) {
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
