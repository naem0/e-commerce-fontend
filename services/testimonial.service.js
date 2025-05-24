import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Get all testimonials
export const getTestimonials = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/testimonials`, { params })
    return response.data
  } catch (error) {
    console.error("Get testimonials error:", error)
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to fetch testimonials",
    }
  }
}

// Get featured testimonials
export const getFeaturedTestimonials = async (limit = 6) => {
  try {
    const response = await axios.get(`${API_URL}/testimonials`, {
      params: { featured: true, limit },
    })
    return response.data
  } catch (error) {
    console.error("Get featured testimonials error:", error)
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to fetch featured testimonials",
    }
  }
}

// Get single testimonial
export const getTestimonialById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/testimonials/${id}`)
    return response.data
  } catch (error) {
    console.error("Get testimonial error:", error)
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to fetch testimonial",
    }
  }
}

// Create testimonial (admin only)
export const createTestimonial = async (testimonialData) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    const response = await axios.post(`${API_URL}/testimonials`, testimonialData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("Create testimonial error:", error)
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to create testimonial",
    }
  }
}

// Update testimonial (admin only)
export const updateTestimonial = async (id, testimonialData) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    const response = await axios.put(`${API_URL}/testimonials/${id}`, testimonialData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("Update testimonial error:", error)
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to update testimonial",
    }
  }
}

// Delete testimonial (admin only)
export const deleteTestimonial = async (id) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    const response = await axios.delete(`${API_URL}/testimonials/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error("Delete testimonial error:", error)
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to delete testimonial",
    }
  }
}
