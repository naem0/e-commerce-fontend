import { createAPI, handleError } from "./api.utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance for users
// const userAPI = axios.create({
//   baseURL: `${API_URL}/users`,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// Add auth token to requests
// userAPI.interceptors.request.use(
//   (config) => {
//     const authHeader = getAuthHeader()
//     if (authHeader) {
//       config.headers = {
//         ...config.headers,
//         ...authHeader,
//       }
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )

// Create user API instance
const userAPI = createAPI("users")

// Get all users (admin only)
export const getUsers = async (params = {}) => {
  try {
    const response = await userAPI.get("/", { params })
    return response
  } catch (error) {
    throw handleError(error)
  }
}

// Get a single user by ID (admin only)
export const getUserById = async (id) => {
  try {
    const response = await userAPI.get(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update a user (admin only)
export const updateUser = async (id, userData) => {
  try {
    const response = await userAPI.put(`/${id}`, userData)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Delete a user (admin only)
export const deleteUser = async (id) => {
  try {
    const response = await userAPI.delete(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get user profile
export const getProfile = async () => {
  try {
    const response = await userAPI.get("/profile")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await userAPI.put("/profile", profileData)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await userAPI.put("/change-password", passwordData)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get user addresses
export const getAddresses = async () => {
  try {
    const response = await userAPI.get("/addresses")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Add a new address
export const addAddress = async (addressData) => {
  try {
    const response = await userAPI.post("/addresses", addressData)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update an address
export const updateAddress = async (id, addressData) => {
  try {
    const response = await userAPI.put(`/addresses/${id}`, addressData)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Delete an address
export const deleteAddress = async (id) => {
  try {
    const response = await userAPI.delete(`/addresses/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Set default address
export const setDefaultAddress = async (id) => {
  try {
    const response = await userAPI.put(`/addresses/${id}/default`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}
