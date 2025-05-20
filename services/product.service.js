import { createAPI, handleError } from "./api.utils"

// Create product API instance
const productAPI = createAPI("products")

// Get all products with optional filters
export const getProducts = async (params = {}) => {
  try {
    const response = await productAPI.get("/", { params })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await productAPI.get(`/${id}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get featured products
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const response = await productAPI.get("/featured", { params: { limit } })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get products by category
export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await productAPI.get(`/category/${categoryId}`, { params })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get products by brand
export const getProductsByBrand = async (brandId, params = {}) => {
  try {
    const response = await productAPI.get(`/brand/${brandId}`, { params })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Search products
export const searchProducts = async (query, params = {}) => {
  try {
    const response = await productAPI.get("/search", {
      params: {
        query,
        ...params,
      },
    })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Add a review to a product
export const addProductReview = async (id, reviewData) => {
  try {
    const response = await productAPI.post(`/${id}/reviews`, reviewData)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}
