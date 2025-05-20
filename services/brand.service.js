import { createAPI, handleError } from "./api.utils"

// Create brand API instance
const brandAPI = createAPI("brands")

// Get all brands
export const getBrands = async (params = {}) => {
  try {
    const response = await brandAPI.get("/", { params })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get a single brand by ID
export const getBrandById = async (id) => {
  try {
    const response = await brandAPI.get(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get featured brands
export const getFeaturedBrands = async (limit = 6) => {
  try {
    const response = await brandAPI.get("/featured", { params: { limit } })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get brand with products
export const getBrandWithProducts = async (id, params = {}) => {
  try {
    const response = await brandAPI.get(`/${id}/products`, { params })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}
