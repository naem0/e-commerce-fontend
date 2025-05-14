// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

/**
 * Common fetch function with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - API response
 */
export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // If we have a token in localStorage, add it to the headers
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Parse the JSON response
    const data = await response.json()

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }

    return data
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    throw error
  }
}

/**
 * API services for products
 */
export const ProductAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return fetchAPI(`/products${queryParams ? `?${queryParams}` : ""}`)
  },
  getById: async (id) => {
    return fetchAPI(`/products/${id}`)
  },
  create: async (data) => {
    return fetchAPI("/products", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  update: async (id, data) => {
    return fetchAPI(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
  delete: async (id) => {
    return fetchAPI(`/products/${id}`, {
      method: "DELETE",
    })
  },
}

/**
 * API services for categories
 */
export const CategoryAPI = {
  getAll: async () => {
    return fetchAPI("/categories")
  },
  getById: async (id) => {
    return fetchAPI(`/categories/${id}`)
  },
  create: async (data) => {
    return fetchAPI("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  update: async (id, data) => {
    return fetchAPI(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
  delete: async (id) => {
    return fetchAPI(`/categories/${id}`, {
      method: "DELETE",
    })
  },
}

/**
 * API services for brands
 */
export const BrandAPI = {
  getAll: async () => {
    return fetchAPI("/brands")
  },
  getById: async (id) => {
    return fetchAPI(`/brands/${id}`)
  },
  create: async (data) => {
    return fetchAPI("/brands", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  update: async (id, data) => {
    return fetchAPI(`/brands/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
  delete: async (id) => {
    return fetchAPI(`/brands/${id}`, {
      method: "DELETE",
    })
  },
}

/**
 * API services for orders
 */
export const OrderAPI = {
  getAll: async () => {
    return fetchAPI("/orders")
  },
  getById: async (id) => {
    return fetchAPI(`/orders/${id}`)
  },
  create: async (data) => {
    return fetchAPI("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  update: async (id, data) => {
    return fetchAPI(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
  delete: async (id) => {
    return fetchAPI(`/orders/${id}`, {
      method: "DELETE",
    })
  },
}

/**
 * API services for cart
 */
export const CartAPI = {
  get: async () => {
    return fetchAPI("/cart")
  },
  update: async (data) => {
    return fetchAPI("/cart", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
  addItem: async (productId, quantity) => {
    return fetchAPI("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    })
  },
  updateItem: async (productId, quantity) => {
    return fetchAPI(`/cart/items/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    })
  },
  removeItem: async (productId) => {
    return fetchAPI(`/cart/items/${productId}`, {
      method: "DELETE",
    })
  },
  clear: async () => {
    return fetchAPI("/cart/clear", {
      method: "POST",
    })
  },
}

/**
 * API services for users
 */
export const UserAPI = {
  register: async (data) => {
    return fetchAPI("/users/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  login: async (credentials) => {
    return fetchAPI("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },
  getProfile: async () => {
    return fetchAPI("/users/profile")
  },
  updateProfile: async (data) => {
    return fetchAPI("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
  getAll: async () => {
    return fetchAPI("/users")
  },
  getById: async (id) => {
    return fetchAPI(`/users/${id}`)
  },
  update: async (id, data) => {
    return fetchAPI(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
  delete: async (id) => {
    return fetchAPI(`/users/${id}`, {
      method: "DELETE",
    })
  },
}

/**
 * API services for site settings
 */
export const SettingsAPI = {
  get: async () => {
    return fetchAPI("/settings")
  },
  update: async (data) => {
    return fetchAPI("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
}

/**
 * API services for auth
 */
export const AuthAPI = {
  login: async (credentials) => {
    return fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },
  register: async (data) => {
    return fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  forgotPassword: async (email) => {
    return fetchAPI("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },
  resetPassword: async (token, password) => {
    return fetchAPI("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    })
  },
  verifyEmail: async (token) => {
    return fetchAPI(`/auth/verify-email/${token}`)
  },
}
