import axios from "axios"
import { getAuthHeader } from "./utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance for products
const productAPI = axios.create({
  baseURL: `${API_URL}/products`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
productAPI.interceptors.request.use(
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

// Get all products with optional filters
export const getProducts = async (params = {}) => {
  try {
    const response = await productAPI.get("/", { params })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await productAPI.get(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Create a new product (admin only)
export const createProduct = async (productData) => {
  try {
    // Create FormData for file uploads
    const formData = new FormData()

    // Append text fields
    Object.keys(productData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, productData[key])
      }
    })

    // Append images
    if (productData.images && productData.images.length) {
      productData.images.forEach((image) => {
        formData.append("images", image)
      })
    }

    const response = await axios.post(`${API_URL}/products`, formData, {
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

// Update a product (admin only)
export const updateProduct = async (id, productData) => {
  try {
    // Create FormData for file uploads
    const formData = new FormData()

    // Append text fields
    Object.keys(productData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, productData[key])
      }
    })

    // Append images
    if (productData.images && productData.images.length) {
      productData.images.forEach((image) => {
        formData.append("images", image)
      })
    }

    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
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

// Delete a product (admin only)
export const deleteProduct = async (id) => {
  try {
    const response = await productAPI.delete(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update product status (admin only)
export const updateProductStatus = async (id, status) => {
  try {
    const response = await productAPI.patch(`/${id}/status`, { status })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Add a review to a product
export const addProductReview = async (id, reviewData) => {
  try {
    const response = await productAPI.post(`/${id}/reviews`, reviewData)
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
