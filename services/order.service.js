import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    const session = await getSession()

    let token = null

    if (session?.accessToken) {
      token = session.accessToken
    } else if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
    }

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    } else {
      return {
        "Content-Type": "application/json",
      }
    }
  } catch (error) {
    return {
      "Content-Type": "application/json",
    }
  }
}

// Get all orders (user's orders)
export const getOrders = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/orders/my-orders${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
    }

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
    const url = `${API_URL}/orders${queryString ? `?${queryString}` : ""}`
    const response = await fetch(url, {
      method: "GET",
      headers,
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
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
    const url = `${API_URL}/orders/${id}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

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
    const url = `${API_URL}/orders`
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

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
    const url = `${API_URL}/orders/${orderId}/payment`

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

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
    const url = `${API_URL}/orders/${orderId}/status`

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

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
    const url = `${API_URL}/orders/${orderId}/status`

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "cancelled" }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}
