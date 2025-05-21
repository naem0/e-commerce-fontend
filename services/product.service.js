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
    return handleError(error)
  }
}

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await productAPI.get(`/${id}`)
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

// Get featured products
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const response = await productAPI.get("/", { params: { featured: true, limit } })
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

// Get products by category
export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await productAPI.get("/", {
      params: {
        category: categoryId,
        ...params,
      },
    })
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

// Get products by brand
export const getProductsByBrand = async (brandId, params = {}) => {
  try {
    const response = await productAPI.get("/", {
      params: {
        brand: brandId,
        ...params,
      },
    })
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

// Search products
export const searchProducts = async (query, params = {}) => {
  try {
    const response = await productAPI.get("/search", {
      params: {
        q: query,
        ...params,
      },
    })
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

// Add a review to a product
// export const addProductReview = async (id, reviewData) => {
//   try {
//     const response = await productAPI.post(`/${id}/reviews`, reviewData)
//     return response.data
//   } catch (error) {
//     throw handleError(error)
//   }
// }

// Helper function to handle errors
function handleError(error) {
  if (error.response) {
    return {
      success: false,
      status: error.response.status,
      message: error.response.data.message || "An error occurred",
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
