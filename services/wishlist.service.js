import { createAPI, handleError } from "./api.utils"

// Create wishlist API instance
const wishlistAPI = createAPI("wishlist")

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const response = await wishlistAPI.get("/")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Add item to wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await wishlistAPI.post("/", { productId })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Remove item from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const response = await wishlistAPI.delete(`/${productId}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Check if item is in wishlist
export const isInWishlist = async (productId) => {
  try {
    const response = await wishlistAPI.get(`/check/${productId}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}
