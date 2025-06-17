import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to get auth headers
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
    const url = `${API_URL}/banners${queryString ? `?${queryString}` : ""}`

    console.log("Fetching banners from:", url)

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
    const url = `${API_URL}/banners/${id}`

    console.log("Fetching banner from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    console.log("Banner API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Banner API error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Banner fetched successfully:", data.banner?.title)
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
    console.log("=== Creating Banner ===")
    console.log("Banner data:", bannerData)

    const headers = await getAuthHeaders()
    const url = `${API_URL}/banners`

    console.log("Creating banner at:", url)
    console.log("Request headers:", headers)

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(bannerData),
    })

    console.log("Create banner response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Create banner error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Banner created successfully:", data)
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
    console.log("=== Updating Banner ===")
    console.log("Banner ID:", id)
    console.log("Banner data:", bannerData)

    const headers = await getAuthHeaders()
    const url = `${API_URL}/banners/${id}`

    console.log("Updating banner at:", url)

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(bannerData),
    })

    console.log("Update banner response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Update banner error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Banner updated successfully:", data)
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
    console.log("=== Deleting Banner ===")
    console.log("Banner ID:", id)

    const headers = await getAuthHeaders()
    const url = `${API_URL}/banners/${id}`

    console.log("Deleting banner at:", url)

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    })

    console.log("Delete banner response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Delete banner error:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("Banner deleted successfully:", data)
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
