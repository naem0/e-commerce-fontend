"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import * as cartService from "@/services/cart.service"
import { getProductById } from "@/services/product.service"

const CartContext = createContext({
  cart: { items: [] },
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateCartItemQuantity: async () => {},
  clearCart: async () => {},
  getCartTotal: () => 0,
  getCartItemCount: () => 0,
  isLoading: false,
})

export function CartProvider({ children }) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [cart, setCart] = useState({ items: [] })
  const [isLoading, setIsLoading] = useState(true)

  // Initialize cart from localStorage or API
  useEffect(() => {
    const initCart = async () => {
      try {
        setIsLoading(true)

        // If user is logged in, fetch cart from API
        if (status === "authenticated") {
          try {
            const response = await cartService.getCart()
            if (response.success) {
              setCart(response.cart)

              // Sync local cart with server if local cart exists
              const localCart = getLocalCart()
              if (localCart?.items?.length > 0) {
                await cartService.syncCart(localCart)
                // Clear local cart after sync
                localStorage.removeItem("cart")
              }
            } else {
              // If API call fails, try to get from localStorage
              const localCart = getLocalCart()
              setCart(localCart)
            }
          } catch (error) {
            console.error("Error fetching cart:", error)
            // Fallback to localStorage
            const localCart = getLocalCart()
            setCart(localCart)
          }
        } else if (status === "unauthenticated") {
          // If user is not logged in, get cart from localStorage
          const localCart = getLocalCart()
          setCart(localCart)
        }
      } catch (error) {
        console.error("Error initializing cart:", error)
        // Fallback to empty cart
        setCart({ items: [] })
      } finally {
        setIsLoading(false)
      }
    }

    if (status !== "loading") {
      initCart()
    }
  }, [status])

  // Save cart to localStorage whenever it changes (for unauthenticated users)
  useEffect(() => {
    if (!isLoading && status === "unauthenticated") {
      saveLocalCart(cart)
    }
  }, [cart, isLoading, status])

  // Get cart from localStorage
  const getLocalCart = () => {
    if (typeof window === "undefined") return { items: [] }

    try {
      const cartData = localStorage.getItem("cart")
      return cartData ? JSON.parse(cartData) : { items: [] }
    } catch (error) {
      console.error("Error getting cart from localStorage:", error)
      return { items: [] }
    }
  }

  // Save cart to localStorage
  const saveLocalCart = (cartData) => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("cart", JSON.stringify(cartData))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }

  // Add item to cart
  const addItemToCart = async (productId, quantity = 1, variation = null) => {
    try {
      setIsLoading(true)

      // If user is logged in, add to API
      if (status === "authenticated") {
        const response = await cartService.addToCart(productId, quantity, variation)
        if (response.success) {
          setCart(response.cart)
          toast({
            title: "Added to Cart",
            description: "Item has been added to your cart",
          })
          return response
        } else {
          throw new Error(response.message || "Failed to add item to cart")
        }
      } else {
        // If user is not logged in, add to local cart
        const productResponse = await getProductById(productId)

        if (!productResponse.success) {
          throw new Error(productResponse.message || "Failed to fetch product")
        }

        const product = productResponse.product

        // Check if product is in stock
        if (product.stock < quantity) {
          throw new Error("Not enough stock available")
        }

        setCart((prevCart) => {
          // Check if product already exists in cart
          const existingItemIndex = prevCart.items.findIndex(
            (item) => item.product._id === productId && JSON.stringify(item.variation) === JSON.stringify(variation),
          )

          if (existingItemIndex !== -1) {
            // Update quantity if product exists
            const updatedItems = [...prevCart.items]
            updatedItems[existingItemIndex].quantity += quantity

            return {
              ...prevCart,
              items: updatedItems,
            }
          } else {
            // Add new item if product doesn't exist
            return {
              ...prevCart,
              items: [
                ...prevCart.items,
                {
                  product,
                  quantity,
                  variation,
                },
              ],
            }
          }
        })

        toast({
          title: "Added to Cart",
          description: "Item has been added to your cart",
        })

        return { success: true, message: "Item added to cart" }
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Remove item from cart
  const removeItemFromCart = async (itemId, variation = null) => {
    try {
      setIsLoading(true)

      // If user is logged in, remove from API
      if (status === "authenticated") {
        const response = await cartService.removeFromCart(itemId)
        if (response.success) {
          setCart(response.cart)
          toast({
            title: "Removed from Cart",
            description: "Item has been removed from your cart",
          })
          return response
        } else {
          throw new Error(response.message || "Failed to remove item from cart")
        }
      } else {
        // If user is not logged in, remove from local cart
        setCart((prevCart) => {
          const updatedItems = prevCart.items.filter(
            (item) =>
              !(
                item._id === itemId ||
                (item.product._id === itemId && JSON.stringify(item.variation) === JSON.stringify(variation))
              ),
          )

          return {
            ...prevCart,
            items: updatedItems,
          }
        })

        toast({
          title: "Removed from Cart",
          description: "Item has been removed from your cart",
        })

        return { success: true, message: "Item removed from cart" }
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update cart item quantity
  const updateItemQuantity = async (itemId, quantity, variation = null) => {
    try {
      setIsLoading(true)

      // If user is logged in, update in API
      if (status === "authenticated") {
        const response = await cartService.updateCartItem(itemId, quantity)
        if (response.success) {
          setCart(response.cart)
          toast({
            title: "Cart Updated",
            description: "Item quantity has been updated",
          })
          return response
        } else {
          throw new Error(response.message || "Failed to update cart")
        }
      } else {
        // If user is not logged in, update in local cart
        setCart((prevCart) => {
          const updatedItems = prevCart.items.map((item) => {
            if (
              item._id === itemId ||
              (item.product._id === itemId && JSON.stringify(item.variation) === JSON.stringify(variation))
            ) {
              return { ...item, quantity }
            }
            return item
          })

          return {
            ...prevCart,
            items: updatedItems,
          }
        })

        toast({
          title: "Cart Updated",
          description: "Item quantity has been updated",
        })

        return { success: true, message: "Cart updated" }
      }
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update cart",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Clear cart
  const clearCartItems = async () => {
    try {
      setIsLoading(true)

      // If user is logged in, clear in API
      if (status === "authenticated") {
        const response = await cartService.clearCart()
        if (response.success) {
          setCart({ items: [] })
          toast({
            title: "Cart Cleared",
            description: "All items have been removed from your cart",
          })
          return response
        } else {
          throw new Error(response.message || "Failed to clear cart")
        }
      } else {
        // If user is not logged in, clear local cart
        setCart({ items: [] })
        toast({
          title: "Cart Cleared",
          description: "All items have been removed from your cart",
        })
        return { success: true, message: "Cart cleared" }
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate cart total
  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price
      return total + price * item.quantity
    }, 0)
  }

  // Get cart item count
  const getCartItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: addItemToCart,
        removeFromCart: removeItemFromCart,
        updateCartItemQuantity: updateItemQuantity,
        clearCart: clearCartItems,
        getCartTotal,
        getCartItemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
