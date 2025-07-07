import { getSession } from "next-auth/react"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

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

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/wishlist`, {
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
      wishlist: { products: [] },
    }
  }
}

// Add item to wishlist
export const addToWishlist = async (productId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/wishlist`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId }),
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

// Remove item from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/wishlist/${productId}`, {
      method: "DELETE",
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

// Check if item is in wishlist
export const checkWishlist = async (productId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/wishlist/check/${productId}`, {
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
      inWishlist: false,
    }
  }
}

// Clear wishlist
export const clearWishlist = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/wishlist`, {
      method: "DELETE",
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
