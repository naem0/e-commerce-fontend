import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    console.log("=== Getting Auth Headers ===")

    // Try to get session first
    const session = await getSession()
    console.log("Session retrieved:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasAccessToken: !!session?.accessToken,
      userEmail: session?.user?.email,
      userRole: session?.user?.role,
    })

    let token = null

    // Get token from session
    if (session?.accessToken) {
      token = session.accessToken
      console.log("Using token from NextAuth session")
    }
    // Fallback: get from localStorage
    else if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
      if (token) {
        console.log("Using token from localStorage")
      }
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

// Get all products
export const getProducts = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/products${queryString ? `?${queryString}` : ""}`

    console.log("Fetching products from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    console.log("Products API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Products API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Products fetched successfully:", data.products?.length || 0, "items")
    return data
  } catch (error) {
    console.error("Get products error:", error)
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

    console.log("Fetching product from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    console.log("Product API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Product API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Product fetched successfully:", data.product?.name)
    return data
  } catch (error) {
    console.error("Get product error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Create product (Admin only)
export const createProduct = async (productData) => {
  try {
    console.log("=== Creating Product ===")
    console.log("Product data:", productData)

    const headers = await getAuthHeaders()
    const url = `${API_URL}/products`

    console.log("Creating product at:", url)
    console.log("Request headers:", headers)

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(productData),
    })

    console.log("Create product response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Create product error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Product created successfully:", data)
    return data
  } catch (error) {
    console.error("Create product error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Update product (Admin only)
export const updateProduct = async (id, productData) => {
  try {
    console.log("=== Updating Product ===")
    console.log("Product ID:", id)
    console.log("Product data:", productData)

    const headers = await getAuthHeaders()
    const url = `${API_URL}/products/${id}`

    console.log("Updating product at:", url)

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(productData),
    })

    console.log("Update product response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Update product error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Product updated successfully:", data)
    return data
  } catch (error) {
    console.error("Update product error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Delete product (Admin only)
export const deleteProduct = async (id) => {
  try {
    console.log("=== Deleting Product ===")
    console.log("Product ID:", id)

    const headers = await getAuthHeaders()
    const url = `${API_URL}/products/${id}`

    console.log("Deleting product at:", url)

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    })

    console.log("Delete product response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Delete product error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Product deleted successfully:", data)
    return data
  } catch (error) {
    console.error("Delete product error:", error)
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

    console.log("Searching products at:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Search products error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Products search completed:", data.products?.length || 0, "results")
    return data
  } catch (error) {
    console.error("Search products error:", error)
    return {
      success: false,
      message: error.message,
      products: [],
    }
  }
}
