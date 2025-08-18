const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const getAuthHeaders = (isFormData = false) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const headers = {}

  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/auth/login"
    }
    const error = await response.json()
    throw new Error(error.message || "Something went wrong")
  }
  return response.json()
}

const apiRequest = async (method, path, data, isFormData = false) => {
  const headers = getAuthHeaders(isFormData)
  const url = `${API_URL}/api${path}`

  const options = {
    method,
    headers,
  }

  if (data) {
    if (isFormData) {
      options.body = data
    } else {
      options.body = JSON.stringify(data)
    }
  }

  const response = await fetch(url, options)
  return handleResponse(response)
}

const api = {
  get: (path, params) => {
    const url = params ? `${path}?${new URLSearchParams(params)}` : path
    return apiRequest("GET", url)
  },
  post: (path, data) => apiRequest("POST", path, data),
  put: (path, data) => apiRequest("PUT", path, data),
  patch: (path, data) => apiRequest("PATCH", path, data),
  delete: (path) => apiRequest("DELETE", path),
  postForm: (path, formData) => apiRequest("POST", path, formData, true),
  putForm: (path, formData) => apiRequest("PUT", path, formData, true),
}

// Auth services
export const authService = {
  register: async (userData) => {
    return api.post("/auth/register", userData)
  },
  login: async (credentials) => {
    const data = await api.post("/auth/login", credentials)
    if (data.token && typeof window !== "undefined") {
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
    }
    return data
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  },
  getCurrentUser: async () => {
    return api.get("/auth/me")
  },
}

// Product services
export const productService = {
  getProducts: async (params) => {
    return api.get("/products", params)
  },
  getProduct: async (id) => {
    return api.get(`/products/${id}`)
  },
  createProduct: async (productData) => {
    const formData = new FormData()
    Object.keys(productData).forEach((key) => {
      if (key === "images") {
        productData.images.forEach((image) => {
          formData.append("images", image)
        })
      } else {
        formData.append(key, productData[key])
      }
    })
    return api.postForm("/products", formData)
  },
  updateProduct: async (id, productData) => {
    const formData = new FormData()
    Object.keys(productData).forEach((key) => {
      if (key === "images") {
        productData.images.forEach((image) => {
          formData.append("images", image)
        })
      } else {
        formData.append(key, productData[key])
      }
    })
    return api.putForm(`/products/${id}`, formData)
  },
  deleteProduct: async (id) => {
    return api.delete(`/products/${id}`)
  },
  updateProductStatus: async (id, status) => {
    return api.patch(`/products/${id}/status`, { status })
  },
  addReview: async (id, reviewData) => {
    return api.post(`/products/${id}/reviews`, reviewData)
  },
}

// Category services
export const categoryService = {
  getCategories: async (params) => {
    return api.get("/categories", params)
  },
  getCategory: async (id) => {
    return api.get(`/categories/${id}`)
  },
  createCategory: async (categoryData) => {
    const formData = new FormData()
    Object.keys(categoryData).forEach((key) => {
      if (key === "image") {
        formData.append("image", categoryData.image)
      } else {
        formData.append(key, categoryData[key])
      }
    })
    return api.postForm("/categories", formData)
  },
  updateCategory: async (id, categoryData) => {
    const formData = new FormData()
    Object.keys(categoryData).forEach((key) => {
      if (key === "image") {
        formData.append("image", categoryData.image)
      } else {
        formData.append(key, categoryData[key])
      }
    })
    return api.putForm(`/categories/${id}`, formData)
  },
  deleteCategory: async (id) => {
    return api.delete(`/categories/${id}`)
  },
}

// Brand services
export const brandService = {
  getBrands: async (params) => {
    return api.get("/brands", params)
  },
  getBrand: async (id) => {
    return api.get(`/brands/${id}`)
  },
  createBrand: async (brandData) => {
    const formData = new FormData()
    Object.keys(brandData).forEach((key) => {
      if (key === "logo") {
        formData.append("logo", brandData.logo)
      } else {
        formData.append(key, brandData[key])
      }
    })
    return api.postForm("/brands", formData)
  },
  updateBrand: async (id, brandData) => {
    const formData = new FormData()
    Object.keys(brandData).forEach((key) => {
      if (key === "logo") {
        formData.append("logo", brandData.logo)
      } else {
        formData.append(key, brandData[key])
      }
    })
    return api.putForm(`/brands/${id}`, formData)
  },
  deleteBrand: async (id) => {
    return api.delete(`/brands/${id}`)
  },
}

// Order services
export const orderService = {
  getOrders: async (params) => {
    return api.get("/orders", params)
  },
  getMyOrders: async (params) => {
    return api.get("/orders/my-orders", params)
  },
  getOrder: async (id) => {
    return api.get(`/orders/${id}`)
  },
  createOrder: async (orderData) => {
    return api.post("/orders", orderData)
  },
  updateOrderStatus: async (id, status) => {
    return api.patch(`/orders/${id}/status`, { status })
  },
  updatePaymentStatus: async (id, paymentData) => {
    return api.patch(`/orders/${id}/payment`, paymentData)
  },
}

// User services
export const userService = {
  getUsers: async (params) => {
    return api.get("/users", params)
  },
  getUser: async (id) => {
    return api.get(`/users/${id}`)
  },
  updateUser: async (id, userData) => {
    return api.put(`/users/${id}`, userData)
  },
  deleteUser: async (id) => {
    return api.delete(`/users/${id}`)
  },
  updateProfile: async (profileData) => {
    return api.put("/users/profile/update", profileData)
  },
}

// Site settings services
export const siteSettingsService = {
  getSiteSettings: async () => {
    return api.get("/site-settings")
  },
  updateSiteSettings: async (settingsData) => {
    const formData = new FormData()
    Object.keys(settingsData).forEach((key) => {
      if (key === "logo" || key === "favicon") {
        formData.append(key, settingsData[key])
      } else if (typeof settingsData[key] === "object") {
        formData.append(key, JSON.stringify(settingsData[key]))
      } else {
        formData.append(key, settingsData[key])
      }
    })
    return api.putForm("/site-settings", formData)
  },
}

export default api