import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    console.log("=== Getting Auth Headers (Categories) ===")

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
      console.log("Using token from NextAuth session", token)
    }
    // Fallback: get from localStorage
    else if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
      if (token) {
        console.log("Using token from localStorage", token)
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

// Get all categories
export const getCategories = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/categories${queryString ? `?${queryString}` : ""}`

    console.log("Fetching categories from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    console.log("Categories API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Categories API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Categories fetched successfully:", data.categories?.length || 0, "items")
    return data
  } catch (error) {
    console.error("Get categories error:", error)
    return {
      success: false,
      message: error.message,
      categories: [],
    }
  }
}

// Get single category
export const getCategoryById = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/categories/${id}`

    console.log("Fetching category from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    console.log("Category API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Category API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Category fetched successfully:", data.category?.name)
    return data
  } catch (error) {
    console.error("Get category error:", error)
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
    console.log("=== Creating Category ===")
    console.log("Category data:", categoryData)

    const headers = await getAuthHeaders()
    const url = `${API_URL}/categories`

    console.log("Creating category at:", url)
    console.log("Request headers:", headers)

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(categoryData),
    })

    console.log("Create category response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Create category error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Category created successfully:", data)
    return data
  } catch (error) {
    console.error("Create category error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Update category (Admin only)
export const updateCategory = async (id, categoryData) => {
  try {
    console.log("=== Updating Category ===")
    console.log("Category ID:", id)
    console.log("Category data:", categoryData)

    const headers = await getAuthHeaders()
    const url = `${API_URL}/categories/${id}`

    console.log("Updating category at:", url)

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(categoryData),
    })

    console.log("Update category response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Update category error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Category updated successfully:", data)
    return data
  } catch (error) {
    console.error("Update category error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Delete category (Admin only)
export const deleteCategory = async (id) => {
  try {
    console.log("=== Deleting Category ===")
    console.log("Category ID:", id)

    const headers = await getAuthHeaders()
    const url = `${API_URL}/categories/${id}`

    console.log("Deleting category at:", url)

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    })

    console.log("Delete category response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Delete category error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Category deleted successfully:", data)
    return data
  } catch (error) {
    console.error("Delete category error:", error)
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
    const url = `${API_URL}/categories/${id}/products${queryString ? `?${queryString}` : ""}`

    console.log("Fetching category with products from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Category with products error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Category with products fetched successfully")
    return data
  } catch (error) {
    console.error("Get category with products error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}
