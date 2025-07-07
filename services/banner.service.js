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

// Get all banners
export const getBanners = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/banners${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Banners API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Get banners error:", error)
    return {
      success: false,
      message: error.message,
      banners: [],
    }
  }
}

// Get single banner
export const getBannerById = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/banners/${id}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Banner API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Get banner error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Create banner (Admin only)
export const createBanner = async (bannerData) => {
  try {
    const headers = await getAuthHeadersForFormData()
    const url = `${API_URL}/api/banners`

    // Create FormData
    const formData = new FormData()

    // Add text fields
    formData.append("title", bannerData.title || "")
    formData.append("subtitle", bannerData.subtitle || "")
    formData.append("description", bannerData.description || "")
    formData.append("buttonText", bannerData.buttonText || "Shop Now")
    formData.append("buttonLink", bannerData.buttonLink || "/products")
    formData.append("backgroundColor", bannerData.backgroundColor || "#f8fafc")
    formData.append("textColor", bannerData.textColor || "#1e293b")
    formData.append("enabled", bannerData.enabled || true)

    // Add image file if exists
    if (bannerData.image && bannerData.image instanceof File) {
      formData.append("image", bannerData.image)
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Create banner error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Create banner error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Update banner (Admin only)
export const updateBanner = async (id, bannerData) => {
  try {
    const headers = await getAuthHeadersForFormData()
    const url = `${API_URL}/api/banners/${id}`

    // Create FormData
    const formData = new FormData()

    // Add text fields
    formData.append("title", bannerData.title || "")
    formData.append("subtitle", bannerData.subtitle || "")
    formData.append("description", bannerData.description || "")
    formData.append("buttonText", bannerData.buttonText || "Shop Now")
    formData.append("buttonLink", bannerData.buttonLink || "/products")
    formData.append("backgroundColor", bannerData.backgroundColor || "#f8fafc")
    formData.append("textColor", bannerData.textColor || "#1e293b")
    formData.append("enabled", bannerData.enabled || true)

    // Add image file if exists
    if (bannerData.image && bannerData.image instanceof File) {
      formData.append("image", bannerData.image)
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Update banner error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Update banner error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Delete banner (Admin only)
export const deleteBanner = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/banners/${id}`

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Delete banner error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Delete banner error:", error)
    return {
      success: false,
      message: error.message,
    }
  }
}

// Get active banners
export const getActiveBanners = async () => {
  return getBanners({ status: "active" })
}
