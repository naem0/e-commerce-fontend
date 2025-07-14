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
    console.error("Error getting auth headers:", error)
    return {
      "Content-Type": "application/json",
    }
  }
}

// Add product review
export const addProductReview = async (productId, reviewData) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/products/${productId}/reviews`

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Review API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Add product review error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Get product reviews
export const getProductReviews = async (productId, params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/products/${productId}/reviews${queryString ? `?${queryString}` : ""}`

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
    console.error("Get product reviews error:", error)
    return {
      success: false,
      message: error.message,
      reviews: [],
    }
  }
}

// Update review
export const updateReview = async (productId, reviewId, reviewData) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/products/${productId}/reviews/${reviewId}`

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Update review error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Delete review
export const deleteReview = async (productId, reviewId) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/products/${productId}/reviews/${reviewId}`

    const response = await fetch(url, {
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
    console.error("Delete review error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}
