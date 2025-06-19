import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to get auth headers
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
    const url = `${API_URL}/banners${queryString ? `?${queryString}` : ""}`

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
    const headers = await getAuthHeaders()
    const url = `${API_URL}/banners`

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(bannerData),
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
    const headers = await getAuthHeaders()
    const url = `${API_URL}/banners/${id}`

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(bannerData),
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
    const url = `${API_URL}/banners/${id}`

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
