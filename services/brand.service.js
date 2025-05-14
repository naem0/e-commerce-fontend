import axios from "axios"
import { getAuthHeader } from "./utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance for brands
const brandAPI = axios.create({
  baseURL: `${API_URL}/brands`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
brandAPI.interceptors.request.use(
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

// Get all brands
export const getBrands = async () => {
  try {
    const response = await brandAPI.get("/")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get a single brand by ID
export const getBrandById = async (id) => {
  try {
    const response = await brandAPI.get(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Create a new brand (admin only)
export const createBrand = async (brandData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData()

    // Append text fields
    Object.keys(brandData).forEach((key) => {
      if (key !== "logo") {
        formData.append(key, brandData[key])
      }
    })

    // Append logo if exists
    if (brandData.logo) {
      formData.append("logo", brandData.logo)
    }

    const response = await axios.post(`${API_URL}/brands`, formData, {
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

// Update a brand (admin only)
export const updateBrand = async (id, brandData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData()

    // Append text fields
    Object.keys(brandData).forEach((key) => {
      if (key !== "logo") {
        formData.append(key, brandData[key])
      }
    })

    // Append logo if exists
    if (brandData.logo) {
      formData.append("logo", brandData.logo)
    }

    const response = await axios.put(`${API_URL}/brands/${id}`, formData, {
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

// Delete a brand (admin only)
export const deleteBrand = async (id) => {
  try {
    const response = await brandAPI.delete(`/${id}`)
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
