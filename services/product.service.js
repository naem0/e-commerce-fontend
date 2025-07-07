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
    const url = `${API_URL}/api/products${queryString ? `?${queryString}` : ""}`

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
    const url = `${API_URL}/api/products/${id}`

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
    const headers = await getAuthHeadersForFormData()
    const url = `${API_URL}/api/products`

    // Create FormData
    const formData = new FormData()

    // Add basic fields
    formData.append("name", productData.name || "")
    formData.append("description", productData.description || "")
    formData.append("shortDescription", productData.shortDescription || "")
    formData.append("price", productData.price || "0")
    formData.append("comparePrice", productData.comparePrice || "")
    formData.append("category", productData.category || "")
    formData.append("brand", productData.brand || "")
    formData.append("stock", productData.stock || "0")
    formData.append("featured", productData.featured || false)
    formData.append("status", productData.status || "draft")
    formData.append("sku", productData.sku || "")
    formData.append("weight", productData.weight || "")
    formData.append("hasVariations", productData.hasVariations || false)

    // Add dimensions
    if (productData.dimensions) {
      formData.append("dimensions", JSON.stringify(productData.dimensions))
    }

    // Add tags
    if (productData.tags && Array.isArray(productData.tags)) {
      formData.append("tags", JSON.stringify(productData.tags))
    }

    // Add SEO data
    if (productData.seo) {
      formData.append("seo", JSON.stringify(productData.seo))
    }

    // Add shipping data
    if (productData.shipping) {
      formData.append("shipping", JSON.stringify(productData.shipping))
    }

    // Add variation data
    if (productData.hasVariations) {
      if (productData.variationTypes) {
        formData.append("variationTypes", JSON.stringify(productData.variationTypes))
      }
      if (productData.variants) {
        formData.append("variants", JSON.stringify(productData.variants))
      }
    }

    // Add main product images
    if (productData.images && Array.isArray(productData.images)) {
      productData.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append("images", image)
        }
      })
    }

    // Add variant images
    if (productData.variants && Array.isArray(productData.variants)) {
      productData.variants.forEach((variant, variantIndex) => {
        if (variant.images && Array.isArray(variant.images)) {
          variant.images.forEach((image, imageIndex) => {
            if (image instanceof File) {
              formData.append(`variantImages_${variantIndex}`, image)
            }
          })
        }
      })
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

// Update product (Admin only)
export const updateProduct = async (id, productData) => {
  try {
    const headers = await getAuthHeadersForFormData()
    const url = `${API_URL}/api/products/${id}`

    // Create FormData
    const formData = new FormData()

    // Add basic fields
    formData.append("name", productData.name || "")
    formData.append("description", productData.description || "")
    formData.append("shortDescription", productData.shortDescription || "")
    formData.append("price", productData.price || "0")
    formData.append("comparePrice", productData.comparePrice || "")
    formData.append("category", productData.category || "")
    formData.append("brand", productData.brand || "")
    formData.append("stock", productData.stock || "0")
    formData.append("featured", productData.featured || false)
    formData.append("status", productData.status || "draft")
    formData.append("sku", productData.sku || "")
    formData.append("weight", productData.weight || "")
    formData.append("hasVariations", productData.hasVariations || false)

    // Add dimensions
    if (productData.dimensions) {
      formData.append("dimensions", JSON.stringify(productData.dimensions))
    }

    // Add tags
    if (productData.tags && Array.isArray(productData.tags)) {
      formData.append("tags", JSON.stringify(productData.tags))
    }

    // Add SEO data
    if (productData.seo) {
      formData.append("seo", JSON.stringify(productData.seo))
    }

    // Add shipping data
    if (productData.shipping) {
      formData.append("shipping", JSON.stringify(productData.shipping))
    }

    // Add variation data
    if (productData.hasVariations) {
      if (productData.variationTypes) {
        formData.append("variationTypes", JSON.stringify(productData.variationTypes))
      }
      if (productData.variants) {
        formData.append("variants", JSON.stringify(productData.variants))
      }
    }

    // Add main product images
    if (productData.images && Array.isArray(productData.images)) {
      productData.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append("images", image)
        }
      })
    }

    // Add variant images
    if (productData.variants && Array.isArray(productData.variants)) {
      productData.variants.forEach((variant, variantIndex) => {
        if (variant.images && Array.isArray(variant.images)) {
          variant.images.forEach((image, imageIndex) => {
            if (image instanceof File) {
              formData.append(`variantImages_${variantIndex}`, image)
            }
          })
        }
      })
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

// Delete product (Admin only)
export const deleteProduct = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/products/${id}`

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
    const url = `${API_URL}/api/products/search?${searchParams.toString()}`

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
