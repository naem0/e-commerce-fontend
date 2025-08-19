import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Helper function to get auth headers
const getAuthHeaders = async (isFormData = false) => {
  try {
    const session = await getSession()
    let token = session?.accessToken || null

    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
    }

    const headers = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    }

    return headers
  } catch (error) {
    return isFormData ? {} : { "Content-Type": "application/json" }
  }
}

/**
 * USER REVIEW ENDPOINTS
 */

// Add product review
export const addProductReview = async (productId, reviewData) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/products/${productId}/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// Get product reviews
export const getProductReviews = async (productId, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/reviews/product/${productId}${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    return await response.json()
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
    const response = await fetch(`${API_URL}/api/products/${productId}/reviews/${reviewId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// Delete review (User)
export const deleteReview = async (reviewId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    return await response.json()
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// Create review with images
export const createReview = async (reviewData) => {
  try {
    const headers = await getAuthHeaders(true)
    const formData = new FormData()

    formData.append("productId", reviewData.productId)
    formData.append("orderId", reviewData.orderId)
    formData.append("rating", reviewData.rating)
    formData.append("title", reviewData.title)
    formData.append("comment", reviewData.comment)

    if (reviewData.images?.length) {
      reviewData.images.forEach((image) => {
        formData.append("images", image)
      })
    }

    const response = await fetch(`${API_URL}/api/reviews`, {
      method: "POST",
      headers,
      body: formData,
    })
    return await response.json()
  } catch (error) {
    return { success: false, message: error.message }
  }
}

/**
 * ADMIN REVIEW ENDPOINTS
 */

// Get all reviews
export const getAllReviews = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/reviews${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, { method: "GET", headers })
    return await response.json()
  } catch (error) {
    return { success: false, message: error.message, reviews: [] }
  }
}

// Update review status (Admin)
export const updateReviewStatus = async (reviewId, status) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    })

    return await response.json()
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// Add admin response
export const addAdminResponse = async (reviewId, message) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}/response`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message }),
    })

    return await response.json()
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// Delete review (Admin)
export const deleteReviewAdmin = async (reviewId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers,
    })

    return await response.json()
  } catch (error) {
    return { success: false, message: error.message }
  }
}

export const reviewService = {
  addProductReview,
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewStatus,
  addAdminResponse,
  deleteReviewAdmin,
}
