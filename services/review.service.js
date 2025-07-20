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
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/reviews/product/${productId}${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
      reviews: [],
      statistics: {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      },
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
export const deleteReview = async (reviewId) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/reviews/${reviewId}`

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
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

// Create review
export const createReview = async (reviewData) => {
  try {
    const isFormData = reviewData instanceof FormData
    const headers = await getAuthHeaders(isFormData)
    const url = `${API_URL}/api/reviews`

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: reviewData,
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

// Get all reviews (Admin)
export const getAllReviews = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/reviews${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
      reviews: [],
    }
  }
}

// Update review status (Admin)
export const updateReviewStatus = async (reviewId, status) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/reviews/${reviewId}/status`

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
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

// Add admin response
export const addAdminResponse = async (reviewId, message) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/reviews/${reviewId}/response`

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
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
