import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Helper function to get auth headers
const getAuthHeaders = async (isFormData = false) => {
  try {
    const session = await getSession()

    let token = null

    if (session?.accessToken) {
      token = session.accessToken
    } else if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
    }

    const headers = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    // Don't set Content-Type for FormData, let browser set it
    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    }

    return headers
  } catch (error) {
    return isFormData ? {} : { "Content-Type": "application/json" }
  }
}

// Get all orders (user's orders)
export const getOrders = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/orders/my-orders${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
      orders: [],
    }
  }
}

// Get all orders (admin)
export const getAllOrders = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/orders${queryString ? `?${queryString}` : ""}`
    const response = await fetch(url, {
      method: "GET",
      headers,
    })
    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
      orders: [],
    }
  }
}

// Get single order
export const getOrderById = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/orders/${id}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Create order
export const createOrder = async (orderData) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/orders`
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Create order by admin
export const createOrderByAdmin = async (orderData) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/orders/admin`
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Add partial payment (supports FormData for file upload)
export const addPartialPayment = async (orderId, paymentData) => {
  try {
    const isFormData = paymentData instanceof FormData
    const headers = await getAuthHeaders(isFormData)
    const url = `${API_URL}/api/orders/${orderId}/payments`

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: paymentData,
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Confirm payment (Admin only)
export const confirmPayment = async (orderId, paymentId, confirmData) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/orders/${orderId}/payments/${paymentId}/confirm`

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(confirmData),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Update payment status
export const updatePaymentStatus = async (orderId, paymentData) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/orders/${orderId}/payment`

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(paymentData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/orders/${orderId}/status`

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/orders/${orderId}/status`

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "cancelled" }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}
