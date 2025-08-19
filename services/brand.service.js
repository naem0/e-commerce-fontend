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
    console.error("Error getting auth headers:", error)
    return {}
  }
}

// Helper function to get auth headers for JSON
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

// Get all brands
export const getBrands = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/brands${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Get brands error:", error)
    return {
      success: false,
      message: error.message,
      brands: [],
    }
  }
}

// Get single brand
export const getBrandById = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/brands/${id}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Get brand error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Create brand (Admin only)
export const createBrand = async (brandData) => {
  try {
    const headers = await getAuthHeadersForFormData()
    const url = `${API_URL}/api/brands`

    // Create FormData
    const formData = new FormData()

    // Add text fields
    formData.append("name", brandData.name || "")
    formData.append("description", brandData.description || "")
    formData.append("website", brandData.website || "")
    formData.append("status", brandData.status || "active")

    // Add logo file if exists
    if (brandData.logo && brandData.logo instanceof File) {
      formData.append("logo", brandData.logo)
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Create brand error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Update brand (Admin only)
export const updateBrand = async (id, brandData) => {
  try {
    const headers = await getAuthHeadersForFormData()
    const url = `${API_URL}/api/brands/${id}`

    // Create FormData
    const formData = new FormData()

    // Add text fields
    formData.append("name", brandData.name || "")
    formData.append("description", brandData.description || "")
    formData.append("website", brandData.website || "")
    formData.append("status", brandData.status || "active")

    // Add logo file if exists
    if (brandData.logo && brandData.logo instanceof File) {
      formData.append("logo", brandData.logo)
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: formData,
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Update brand error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Delete brand (Admin only)
export const deleteBrand = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/brands/${id}`

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Delete brand error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Get featured brands
export const getFeaturedBrands = async (limit = 6) => {
  return getBrands({ featured: true, limit })
}

// Get brand with products
export const getBrandWithProducts = async (id, params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/brands/${id}/products${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Get brand with products error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}
