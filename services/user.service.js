import axios from "axios"
import { getAuthHeader } from "./utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance for users
const userAPI = axios.create({
  baseURL: `${API_URL}/users`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
userAPI.interceptors.request.use(
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

// Get all users (admin only)
export const getUsers = async (params = {}) => {
  try {
    const response = await userAPI.get("/", { params })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get a single user by ID (admin only)
export const getUserById = async (id) => {
  try {
    const response = await userAPI.get(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update a user (admin only)
export const updateUser = async (id, userData) => {
  try {
    const response = await userAPI.put(`/${id}`, userData)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Delete a user (admin only)
export const deleteUser = async (id) => {
  try {
    const response = await userAPI.delete(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await userAPI.put("/profile", profileData)
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
