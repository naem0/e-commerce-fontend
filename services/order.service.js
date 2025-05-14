import axios from "axios"
import { getAuthHeader } from "./utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance for orders
const orderAPI = axios.create({
  baseURL: `${API_URL}/orders`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
orderAPI.interceptors.request.use(
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

// Get all orders (admin) or user's orders
export const getOrders = async (params = {}) => {
  try {
    const response = await orderAPI.get("/", { params })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get user's orders
export const getMyOrders = async (params = {}) => {
  try {
    const response = await orderAPI.get("/my-orders", { params })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get a single order by ID
export const getOrderById = async (id) => {
  try {
    const response = await orderAPI.get(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await orderAPI.post("/", orderData)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update order status (admin only)
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await orderAPI.patch(`/${id}/status`, { status })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update payment status
export const updatePaymentStatus = async (id, paymentData) => {
  try {
    const response = await orderAPI.patch(`/${id}/payment`, paymentData)
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
