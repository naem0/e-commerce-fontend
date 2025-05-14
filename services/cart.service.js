import axios from "axios"
import { getAuthHeader } from "./utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance for cart
const cartAPI = axios.create({
  baseURL: `${API_URL}/cart`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
cartAPI.interceptors.request.use(
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

// Get user's cart
export const getCart = async () => {
  try {
    const response = await cartAPI.get("/")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update user's cart
export const updateCart = async (items) => {
  try {
    const response = await cartAPI.put("/", { items })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Add item to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await cartAPI.post("/items", { productId, quantity })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update cart item quantity
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await cartAPI.put(`/items/${productId}`, { quantity })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Remove item from cart
export const removeFromCart = async (productId) => {
  try {
    const response = await cartAPI.delete(`/items/${productId}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Clear cart
export const clearCart = async () => {
  try {
    const response = await cartAPI.delete("/")
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
