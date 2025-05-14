import axios from "axios"
import { getAuthHeader } from "./utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance for categories
const categoryAPI = axios.create({
  baseURL: `${API_URL}/categories`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
categoryAPI.interceptors.request.use(
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

// Get all categories
export const getCategories = async () => {
  try {
    const response = await categoryAPI.get("/")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get a single category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await categoryAPI.get(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Create a new category (admin only)
export const createCategory = async (categoryData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData()

    // Append text fields
    Object.keys(categoryData).forEach((key) => {
      if (key !== "image") {
        formData.append(key, categoryData[key])
      }
    })

    // Append image if exists
    if (categoryData.image) {
      formData.append("image", categoryData.image)
    }

    const response = await axios.post(`${API_URL}/categories`, formData, {
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

// Update a category (admin only)
export const updateCategory = async (id, categoryData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData()

    // Append text fields
    Object.keys(categoryData).forEach((key) => {
      if (key !== "image") {
        formData.append(key, categoryData[key])
      }
    })

    // Append image if exists
    if (categoryData.image) {
      formData.append("image", categoryData.image)
    }

    const response = await axios.put(`${API_URL}/categories/${id}`, formData, {
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

// Delete a category (admin only)
export const deleteCategory = async (id) => {
  try {
    const response = await categoryAPI.delete(`/${id}`)
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
