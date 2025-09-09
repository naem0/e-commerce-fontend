import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Helper function to get auth headers for FormData
const getAuthHeadersForFormData = async () => {
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
        // Don't set Content-Type for FormData, let browser set it
      }
    } else {
      return {}
    }
  } catch (error) {
    return {}
  }
}

// Helper function to get auth headers for JSON
const getAuthHeaders = async () => {
  try {
    // Try to get session first
    const session = await getSession()

    let token = null

    // Get token from session
    if (session?.accessToken) {
      token = session.accessToken
    }
    // Fallback: get from localStorage
    else if (typeof window !== "undefined") {
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

// Get all categories
export const getCategories = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/categories${queryString ? `?${queryString}` : ""}`

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
      categories: [],
    }
  }
}

export const getCategoryBySlug = async (slug) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/categories/slug/${slug}`

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

// Get single category
export const getCategoryById = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/categories/${id}`

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

// Alias for getCategoryById
export const getCategory = async (id) => {
  return getCategoryById(id)
}

// Create category (Admin only)
export const createCategory = async (categoryData) => {
  try {
    const headers = await getAuthHeadersForFormData()
    const url = `${API_URL}/api/categories`

    // Create FormData
    const formData = new FormData()

    // Add text fields
    formData.append("name", categoryData.name || "")
    formData.append("description", categoryData.description || "")
    formData.append("parent", categoryData.parent || "")
    formData.append("status", categoryData.status || "active")

    // Add image file if exists
    if (categoryData.image && categoryData.image instanceof File) {
      formData.append("image", categoryData.image)
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
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

// Update category (Admin only)
export const updateCategory = async (id, categoryData) => {
  try {
    const headers = await getAuthHeadersForFormData()
    const url = `${API_URL}/api/categories/${id}`

    // Create FormData
    const formData = new FormData()

    // Add text fields
    formData.append("name", categoryData.name || "")
    formData.append("description", categoryData.description || "")
    formData.append("parent", categoryData.parent || "")
    formData.append("status", categoryData.status || "active")

    // Add image file if exists
    if (categoryData.image && categoryData.image instanceof File) {
      formData.append("image", categoryData.image)
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: formData,
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

// Delete category (Admin only)
export const deleteCategory = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/categories/${id}`

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
    return {
      success: false,
      message: error.message,
    }
  }
}

// Get featured categories
export const getFeaturedCategories = async (limit = 6) => {
  return getCategories({ featured: true, limit })
}

// Get category with products
export const getCategoryWithProducts = async (id, params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/categories/${id}/products${queryString ? `?${queryString}` : ""}`

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
