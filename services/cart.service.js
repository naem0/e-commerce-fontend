import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Local storage key for cart
const CART_STORAGE_KEY = "e-commerce-cart"

const getAuthHeaders = async (isFormData = false) => {
  try {
    const session = await getSession();



    let token = null

    if (session?.accessToken) {
      token = session.accessToken
    } else if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
    }

    const headers = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    // Don't set Content-Type for FormData, let browser set it
    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    }



    return headers
  } catch (error) {
    return isFormData ? {} : { "Content-Type": "application/json" }
  }
}

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
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/cart`, {
      headers,
      method: "GET",
    })
    if (!response.ok) {
      throw new Error("Failed to fetch cart")
    }
    return await response.json()
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
    const headers = await getAuthHeaders()

    // Add to authenticated cart
    const response = await fetch(`${API_URL}/api/cart/items`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId, quantity, variation }),
    })

    return await response.json()
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw {
      success: false,
      message: error.message || "Failed to add item to cart",
    }
  }
}

// Update cart item quantity
export const updateCartItem = async (productId, quantity, variationId) => {
  try {
    const headers = await getAuthHeaders()

    // Update authenticated cart
    const response = await fetch(`${API_URL}/api/cart/items`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ productId, quantity, variationId }),
    })

    return await response.json()
  } catch (error) {
    console.error("Error updating cart:", error)
    throw {
      success: false,
      message: error.message || "Failed to update cart",
    }
  }
}

// Remove item from cart
export const removeFromCart = async (productId, variationId) => {
  try {
    const headers = await getAuthHeaders()

    // Remove from authenticated cart
    const response = await fetch(`${API_URL}/api/cart/items`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ productId, variationId }),
    })

    return await response.json()
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw {
      success: false,
      message: error.message || "Failed to remove item from cart",
    }
  }
}

// Clear cart
export const clearCart = async () => {
  try {
    const headers = await getAuthHeaders()

    // Clear authenticated cart
    const response = await fetch(`${API_URL}/api/cart`, {
      method: "DELETE",
      headers,
    })

    return await response.json()
  } catch (error) {
    console.error("Error clearing cart:", error)
    throw {
      success: false,
      message: error.message || "Failed to clear cart",
    }
  }
}

// Sync local cart with server
export const syncCart = async (localCart) => {
  try {
    const headers = await getAuthHeaders()

    if (localCart.items.length === 0) {
      return {
        success: true,
        message: "No items to sync",
      }
    }

    const response = await fetch(`${API_URL}/api/cart/sync`, {
      method: "POST",
      headers,
      body: JSON.stringify({ items: localCart.items }),
    })

    saveLocalCart({ items: [] })
    return await response.json()
  } catch (error) {
    console.error("Error syncing cart:", error)
    throw {
      success: false,
      message: error.message || "Failed to sync cart",
    }
  }
}