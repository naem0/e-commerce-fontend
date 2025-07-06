import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
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

// Get all products
export const getProducts = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/products${queryString ? `?${queryString}` : ""}`

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
      products: [],
    }
  }
}

// Get single product
export const getProductById = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/products/${id}`

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

// Create product (Admin only)
export const createProduct = async (productData) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/products`

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(productData),
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

// Update product (Admin only)
export const updateProduct = async (id, productData) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/products/${id}`

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(productData),
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

// Delete product (Admin only)
export const deleteProduct = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/products/${id}`

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

// Get featured products
export const getFeaturedProducts = async (limit = 8) => {
  return getProducts({ featured: true, limit })
}

// Search products
export const searchProducts = async (query, params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const searchParams = new URLSearchParams({ q: query, ...params })
    const url = `${API_URL}/products/search?${searchParams.toString()}`

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
      products: [],
    }
  }
}
