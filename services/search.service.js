import { createAPI, handleError } from "./api.utils"

// Create search API instance
const searchAPI = createAPI("search")

// Search products
export const searchProducts = async (query, params = {}) => {
  try {
    const response = await searchAPI.get("/products", {
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

// Get search suggestions
export const getSearchSuggestions = async (query) => {
  try {
    const response = await searchAPI.get("/suggestions", { params: { query } })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Get popular searches
export const getPopularSearches = async () => {
  try {
    const response = await searchAPI.get("/popular")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}
