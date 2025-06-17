import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    // Try to get session first
    const session = await getSession()
    let token = null
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
    const url = `${API_URL}/brands${queryString ? `?${queryString}` : ""}`

    console.log("Fetching brands from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    console.log("Brands API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Brands API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Brands fetched successfully:", data.brands?.length || 0, "items")
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
    const url = `${API_URL}/brands/${id}`

    console.log("Fetching brand from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    console.log("Brand API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Brand API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Brand fetched successfully:", data.brand?.name)
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
    const headers = await getAuthHeaders()
    const url = `${API_URL}/brands`


    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(brandData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

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
    console.log("=== Updating Brand ===")
    console.log("Brand ID:", id)
    console.log("Brand data:", brandData)

    const headers = await getAuthHeaders()
    const url = `${API_URL}/brands/${id}`

    console.log("Updating brand at:", url)

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(brandData),
    })

    console.log("Update brand response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Update brand error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Brand updated successfully:", data)
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
    const url = `${API_URL}/brands/${id}`

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Delete brand error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

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
    const url = `${API_URL}/brands/${id}/products${queryString ? `?${queryString}` : ""}`

    console.log("Fetching brand with products from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Brand with products error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Brand with products fetched successfully")
    return data
  } catch (error) {
    console.error("Get brand with products error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}
