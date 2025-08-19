const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const headers = {
    "Content-Type": "application/json",
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

// Get all testimonials
export const getTestimonials = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_URL}/api/testimonials?${query}`)
    return await response.json()
  } catch (error) {
    console.error("Get testimonials error:", error)
    throw {
      success: false,
      message: error.message || "Failed to fetch testimonials",
    }
  }
}

// Get featured testimonials
export const getFeaturedTestimonials = async (limit = 6) => {
  try {
    const response = await fetch(
      `${API_URL}/api/testimonials?featured=true&limit=${limit}`
    )
    return await response.json()
  } catch (error) {
    console.error("Get featured testimonials error:", error)
    throw {
      success: false,
      message: error.message || "Failed to fetch featured testimonials",
    }
  }
}

// Get single testimonial
export const getTestimonialById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/testimonials/${id}`)
    return await response.json()
  } catch (error) {
    console.error("Get testimonial error:", error)
    throw {
      success: false,
      message: error.message || "Failed to fetch testimonial",
    }
  }
}

// Create testimonial (admin only)
export const createTestimonial = async (testimonialData) => {
  try {
    const headers = getAuthHeaders()
    const response = await fetch(`${API_URL}/api/testimonials`, {
      method: "POST",
      headers,
      body: JSON.stringify(testimonialData),
    })
    return await response.json()
  } catch (error) {
    console.error("Create testimonial error:", error)
    throw {
      success: false,
      message: error.message || "Failed to create testimonial",
    }
  }
}

// Update testimonial (admin only)
export const updateTestimonial = async (id, testimonialData) => {
  try {
    const headers = getAuthHeaders()
    const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(testimonialData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update testimonial")
    }
    return await response.json()
  } catch (error) {
    console.error("Update testimonial error:", error)
    throw {
      success: false,
      message: error.message || "Failed to update testimonial",
    }
  }
}

// Delete testimonial (admin only)
export const deleteTestimonial = async (id) => {
  try {
    const headers = getAuthHeaders()
    const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
      method: "DELETE",
      headers,
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete testimonial")
    }
    return await response.json()
  } catch (error) {
    console.error("Delete testimonial error:", error)
    throw {
      success: false,
      message: error.message || "Failed to delete testimonial",
    }
  }
}