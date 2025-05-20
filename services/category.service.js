import { createAPI, handleError } from "./api.utils"

// Create category API instance
const categoryAPI = createAPI("categories")

// Get all categories
export const getCategories = async (params = {}) => {
  try {
    const response = await categoryAPI.get("/", { params })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get a single category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await categoryAPI.get(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get featured categories
export const getFeaturedCategories = async (limit = 6) => {
  try {
    const response = await categoryAPI.get("/featured", { params: { limit } })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get category with products
export const getCategoryWithProducts = async (id, params = {}) => {
  try {
    const response = await categoryAPI.get(`/${id}/products`, { params })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}
