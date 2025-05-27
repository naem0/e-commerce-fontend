import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Get site settings
export const getSiteSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/site-settings`)
    return {
      success: true,
      settings: response.data.settings,
    }
  } catch (error) {
    console.error("Get site settings error:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch settings",
    }
  }
}

// Update site settings
export const updateSiteSettings = async (settings) => {
  try {
    const response = await axios.put(`${API_URL}/site-settings`, settings, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return {
      success: true,
      settings: response.data.settings,
    }
  } catch (error) {
    console.error("Update site settings error:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update settings",
    }
  }
}
