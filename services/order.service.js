import { createAPI, handleError } from "./api.utils"

// Create order API instance
const orderAPI = createAPI("orders")

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

// Cancel an order
export const cancelOrder = async (id, reason = "") => {
  try {
    const response = await orderAPI.post(`/${id}/cancel`, { reason })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Track an order
export const trackOrder = async (id) => {
  try {
    const response = await orderAPI.get(`/${id}/track`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}
