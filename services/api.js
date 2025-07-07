import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL+"/api" || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (only in browser)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401 && typeof window !== "undefined") {
      // Clear localStorage and redirect to login
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  },
)

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData)
    return response.data
  },
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials)
    if (response.data.token && typeof window !== "undefined") {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }
    return response.data
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  },
  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },
}

// Product services
export const productService = {
  getProducts: async (params) => {
    const response = await api.get("/products", { params })
    return response.data
  },
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  createProduct: async (productData) => {
    // Create FormData for file uploads
    const formData = new FormData()

    // Append text fields
    Object.keys(productData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, productData[key])
      }
    })

    // Append images
    if (productData.images && productData.images.length) {
      productData.images.forEach((image) => {
        formData.append("images", image)
      })
    }

    const response = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  updateProduct: async (id, productData) => {
    // Create FormData for file uploads
    const formData = new FormData()

    // Append text fields
    Object.keys(productData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, productData[key])
      }
    })

    // Append images
    if (productData.images && productData.images.length) {
      productData.images.forEach((image) => {
        formData.append("images", image)
      })
    }

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
  updateProductStatus: async (id, status) => {
    const response = await api.patch(`/products/${id}/status`, { status })
    return response.data
  },
  addReview: async (id, reviewData) => {
    const response = await api.post(`/products/${id}/reviews`, reviewData)
    return response.data
  },
}

// Category services
export const categoryService = {
  getCategories: async (params) => {
    const response = await api.get("/categories", { params })
    return response.data
  },
  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },
  createCategory: async (categoryData) => {
    // Create FormData for file upload
    const formData = new FormData()

    // Append text fields
    Object.keys(categoryData).forEach((key) => {
      if (key !== "image") {
        formData.append(key, categoryData[key])
      }
    })

    // Append image if exists
    if (categoryData.image) {
      formData.append("image", categoryData.image)
    }

    const response = await api.post("/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  updateCategory: async (id, categoryData) => {
    // Create FormData for file upload
    const formData = new FormData()

    // Append text fields
    Object.keys(categoryData).forEach((key) => {
      if (key !== "image") {
        formData.append(key, categoryData[key])
      }
    })

    // Append image if exists
    if (categoryData.image) {
      formData.append("image", categoryData.image)
    }

    const response = await api.put(`/categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },
}

// Brand services
export const brandService = {
  getBrands: async (params) => {
    const response = await api.get("/brands", { params })
    return response.data
  },
  getBrand: async (id) => {
    const response = await api.get(`/brands/${id}`)
    return response.data
  },
  createBrand: async (brandData) => {
    // Create FormData for file upload
    const formData = new FormData()

    // Append text fields
    Object.keys(brandData).forEach((key) => {
      if (key !== "logo") {
        formData.append(key, brandData[key])
      }
    })

    // Append logo if exists
    if (brandData.logo) {
      formData.append("logo", brandData.logo)
    }

    const response = await api.post("/brands", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  updateBrand: async (id, brandData) => {
    // Create FormData for file upload
    const formData = new FormData()

    // Append text fields
    Object.keys(brandData).forEach((key) => {
      if (key !== "logo") {
        formData.append(key, brandData[key])
      }
    })

    // Append logo if exists
    if (brandData.logo) {
      formData.append("logo", brandData.logo)
    }

    const response = await api.put(`/brands/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  deleteBrand: async (id) => {
    const response = await api.delete(`/brands/${id}`)
    return response.data
  },
}

// Order services
export const orderService = {
  getOrders: async (params) => {
    const response = await api.get("/orders", { params })
    return response.data
  },
  getMyOrders: async (params) => {
    const response = await api.get("/orders/my-orders", { params })
    return response.data
  },
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },
  createOrder: async (orderData) => {
    const response = await api.post("/orders", orderData)
    return response.data
  },
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status })
    return response.data
  },
  updatePaymentStatus: async (id, paymentData) => {
    const response = await api.patch(`/orders/${id}/payment`, paymentData)
    return response.data
  },
}

// User services
export const userService = {
  getUsers: async (params) => {
    const response = await api.get("/users", { params })
    return response.data
  },
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
  updateProfile: async (profileData) => {
    const response = await api.put("/users/profile/update", profileData)
    return response.data
  },
}

// Site settings services
export const siteSettingsService = {
  getSiteSettings: async () => {
    const response = await api.get("/site-settings")
    return response.data
  },
  updateSiteSettings: async (settingsData) => {
    // Create FormData for file uploads
    const formData = new FormData()

    // Append text fields
    Object.keys(settingsData).forEach((key) => {
      if (key !== "logo" && key !== "favicon") {
        if (typeof settingsData[key] === "object") {
          formData.append(key, JSON.stringify(settingsData[key]))
        } else {
          formData.append(key, settingsData[key])
        }
      }
    })

    // Append logo if exists
    if (settingsData.logo) {
      formData.append("logo", settingsData.logo)
    }

    // Append favicon if exists
    if (settingsData.favicon) {
      formData.append("favicon", settingsData.favicon)
    }

    const response = await api.put("/site-settings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
}

export default api
