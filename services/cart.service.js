import axios from "axios"
import { getAuthHeader } from "./utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Local storage key for cart
const CART_STORAGE_KEY = "e-commerce-cart"

// Get cart from local storage
const getLocalCart = () => {
  if (typeof window === "undefined") return { items: [] }

  const cartData = localStorage.getItem(CART_STORAGE_KEY)
  return cartData ? JSON.parse(cartData) : { items: [] }
}

// Save cart to local storage
const saveLocalCart = (cart) => {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}

// Get user's cart (authenticated or local)
export const getCart = async () => {
  try {
    // Try to get authenticated cart
    const authHeader = getAuthHeader()

    if (authHeader) {
      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: {
          ...authHeader,
        },
      })
      return response.data
    } else {
      // Return local cart if not authenticated
      const localCart = getLocalCart()

      // Calculate totals
      let subtotal = 0
      let totalItems = 0

      localCart.items.forEach((item) => {
        const price = item.product.salePrice || item.product.price
        subtotal += price * item.quantity
        totalItems += item.quantity
      })

      return {
        success: true,
        cart: {
          items: localCart.items,
          subtotal,
          total: subtotal,
          totalItems,
        },
      }
    }
  } catch (error) {
    console.error("Error getting cart:", error)

    // Return local cart on error
    const localCart = getLocalCart()

    // Calculate totals
    let subtotal = 0
    let totalItems = 0

    localCart.items.forEach((item) => {
      const price = item.product.salePrice || item.product.price
      subtotal += price * item.quantity
      totalItems += item.quantity
    })

    return {
      success: true,
      cart: {
        items: localCart.items,
        subtotal,
        total: subtotal,
        totalItems,
      },
    }
  }
}

// Add item to cart
export const addToCart = async (productId, quantity = 1, variation = null) => {
  try {
    const authHeader = getAuthHeader()

    if (authHeader) {
      // Add to authenticated cart
      const response = await axios.post(
        `${API_URL}/api/cart/items`,
        { productId, quantity, variation },
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
          },
        },
      )
      return response.data
    } else {
      // Add to local cart
      const localCart = getLocalCart()

      // Get product details
      const productResponse = await axios.get(`${API_URL}/api/products/${productId}`)
      const product = productResponse.data.product

      // Check if product already exists in cart
      const existingItemIndex = localCart.items.findIndex(
        (item) => item.product._id === productId && JSON.stringify(item.variation) === JSON.stringify(variation),
      )

      if (existingItemIndex !== -1) {
        // Update quantity if product exists
        localCart.items[existingItemIndex].quantity += quantity
      } else {
        // Add new item if product doesn't exist
        localCart.items.push({
          product,
          quantity,
          variation,
        })
      }

      // Save to local storage
      saveLocalCart(localCart)

      // Calculate totals
      let subtotal = 0
      let totalItems = 0

      localCart.items.forEach((item) => {
        const price = item.product.salePrice || item.product.price
        subtotal += price * item.quantity
        totalItems += item.quantity
      })

      return {
        success: true,
        message: "Item added to cart",
        cart: {
          items: localCart.items,
          subtotal,
          total: subtotal,
          totalItems,
        },
      }
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to add item to cart",
    }
  }
}

// Update cart item quantity
export const updateCartItem = async (itemId, quantity) => {
  try {
    const authHeader = getAuthHeader()

    if (authHeader) {
      // Update authenticated cart
      const response = await axios.put(
        `${API_URL}/api/cart/items/${itemId}`,
        { quantity },
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
          },
        },
      )
      return response.data
    } else {
      // Update local cart
      const localCart = getLocalCart()

      // Find item in cart
      const itemIndex = localCart.items.findIndex((item) => item.product._id === itemId)

      if (itemIndex === -1) {
        throw {
          success: false,
          message: "Item not found in cart",
        }
      }

      // Update quantity
      localCart.items[itemIndex].quantity = quantity

      // Save to local storage
      saveLocalCart(localCart)

      // Calculate totals
      let subtotal = 0
      let totalItems = 0

      localCart.items.forEach((item) => {
        const price = item.product.salePrice || item.product.price
        subtotal += price * item.quantity
        totalItems += item.quantity
      })

      return {
        success: true,
        message: "Cart updated",
        cart: {
          items: localCart.items,
          subtotal,
          total: subtotal,
          totalItems,
        },
      }
    }
  } catch (error) {
    console.error("Error updating cart:", error)
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to update cart",
    }
  }
}

// Remove item from cart
export const removeFromCart = async (itemId) => {
  try {
    const authHeader = getAuthHeader()

    if (authHeader) {
      // Remove from authenticated cart
      const response = await axios.delete(`${API_URL}/api/cart/items/${itemId}`, {
        headers: {
          ...authHeader,
        },
      })
      return response.data
    } else {
      // Remove from local cart
      const localCart = getLocalCart()

      // Remove item from cart
      localCart.items = localCart.items.filter((item) => item.product._id !== itemId)

      // Save to local storage
      saveLocalCart(localCart)

      // Calculate totals
      let subtotal = 0
      let totalItems = 0

      localCart.items.forEach((item) => {
        const price = item.product.salePrice || item.product.price
        subtotal += price * item.quantity
        totalItems += item.quantity
      })

      return {
        success: true,
        message: "Item removed from cart",
        cart: {
          items: localCart.items,
          subtotal,
          total: subtotal,
          totalItems,
        },
      }
    }
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to remove item from cart",
    }
  }
}

// Clear cart
export const clearCart = async () => {
  try {
    const authHeader = getAuthHeader()

    if (authHeader) {
      // Clear authenticated cart
      const response = await axios.delete(`${API_URL}/api/cart`, {
        headers: {
          ...authHeader,
        },
      })
      return response.data
    } else {
      // Clear local cart
      saveLocalCart({ items: [] })

      return {
        success: true,
        message: "Cart cleared",
        cart: {
          items: [],
          subtotal: 0,
          total: 0,
          totalItems: 0,
        },
      }
    }
  } catch (error) {
    console.error("Error clearing cart:", error)
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to clear cart",
    }
  }
}

// Sync local cart with server
export const syncCart = async () => {
  try {
    const authHeader = getAuthHeader()

    if (!authHeader) {
      return {
        success: false,
        message: "User not authenticated",
      }
    }

    const localCart = getLocalCart()

    if (localCart.items.length === 0) {
      return {
        success: true,
        message: "No items to sync",
      }
    }

    const response = await axios.post(
      `${API_URL}/api/cart/sync`,
      { items: localCart.items },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
      },
    )

    // Clear local cart after sync
    saveLocalCart({ items: [] })

    return response.data
  } catch (error) {
    console.error("Error syncing cart:", error)
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to sync cart",
    }
  }
}
