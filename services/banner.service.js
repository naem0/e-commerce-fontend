import { apiRequest } from "./api.utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const bannerService = {
  // Get all banners
  getBanners: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString()
      const url = `${API_URL}/banners${queryString ? `?${queryString}` : ""}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch banners")
      }

      return data
    } catch (error) {
      console.error("Error fetching banners:", error)
      throw error
    }
  },

  // Get single banner
  getBanner: async (id) => {
    try {
      const response = await fetch(`${API_URL}/banners/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch banner")
      }

      return data
    } catch (error) {
      console.error("Error fetching banner:", error)
      throw error
    }
  },

  // Create banner (Admin only)
  createBanner: async (bannerData) => {
    return apiRequest(`${API_URL}/banners`, {
      method: "POST",
      body: bannerData,
    })
  },

  // Update banner (Admin only)
  updateBanner: async (id, bannerData) => {
    return apiRequest(`${API_URL}/banners/${id}`, {
      method: "PUT",
      body: bannerData,
    })
  },

  // Delete banner (Admin only)
  deleteBanner: async (id) => {
    return apiRequest(`${API_URL}/banners/${id}`, {
      method: "DELETE",
    })
  },
}

export const { getBanners, getBanner, createBanner, updateBanner, deleteBanner } = bannerService
