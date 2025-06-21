import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    console.log("=== Getting Auth Headers (Order Service) ===")
    const session = await getSession()
    console.log("Session retrieved:", session ? "Found" : "Not found")

    let token = null

    if (session?.accessToken) {
      token = session.accessToken
      console.log("Using token from NextAuth session")
    } else if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
      console.log("Using token from localStorage")
    }

    if (token) {
      console.log("Token found, length:", token.length)
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    } else {
      console.log("No token found")
      return {
        "Content-Type": "application/json",
      }
    }
  } catch (error) {
    console.error("Error getting auth headers:", error)
    return {
      "Content-Type": "application/json",
    }
  }
}

// Get all orders (user's orders)
export const getOrders = async (params = {}) => {
  try {
    console.log("=== Getting User Orders ===")
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/orders/my-orders${queryString ? `?${queryString}` : ""}`

    console.log("Orders API URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    console.log("Orders API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Orders API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Orders API response data:", data)
    return data
  } catch (error) {
    console.error("Get orders error:", error)
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
    console.log("=== Getting Order By ID ===")
    const headers = await getAuthHeaders()
    const url = `${API_URL}/orders/${id}`

    console.log("Order API URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    console.log("Order API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Order API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Order API response data:", data)
    return data
  } catch (error) {
    console.error("Get order error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Create order
export const createOrder = async (orderData) => {
  try {
    console.log("=== Creating Order ===")
    const headers = await getAuthHeaders()
    const url = `${API_URL}/orders`

    console.log("Create order API URL:", url)
    console.log("Order data:", orderData)

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    })

    console.log("Create order API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Create order API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Create order API response data:", data)
    return data
  } catch (error) {
    console.error("Create order error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Update payment status
export const updatePaymentStatus = async (orderId, paymentData) => {
  try {
    console.log("=== Updating Payment Status ===")
    const headers = await getAuthHeaders()
    const url = `${API_URL}/orders/${orderId}/payment`

    console.log("Payment update API URL:", url)
    console.log("Payment data:", paymentData)

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(paymentData),
    })

    console.log("Payment update API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Payment update API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Payment update API response data:", data)
    return data
  } catch (error) {
    console.error("Update payment status error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    console.log("=== Cancelling Order ===")
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
    console.error("Cancel order error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}
