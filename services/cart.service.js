import { createAPI, handleError } from "./api.utils"

// Create cart API instance
const cartAPI = createAPI("cart")

// Get user's cart
export const getCart = async () => {
  try {
    const response = await cartAPI.get("/")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Add item to cart
export const addToCart = async (productId, quantity = 1, variation = null) => {
  try {
    const response = await cartAPI.post("/items", { productId, quantity, variation })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Update cart item quantity
export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await cartAPI.put(`/items/${itemId}`, { quantity })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Remove item from cart
export const removeFromCart = async (itemId) => {
  try {
    const response = await cartAPI.delete(`/items/${itemId}`)
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Clear cart
export const clearCart = async () => {
  try {
    const response = await cartAPI.delete("/")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Apply coupon to cart
export const applyCoupon = async (couponCode) => {
  try {
    const response = await cartAPI.post("/coupon", { code: couponCode })
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}

// Remove coupon from cart
export const removeCoupon = async () => {
  try {
    const response = await cartAPI.delete("/coupon")
    return response.data
  } catch (error) {
    throw handleError(error)
  }
}
