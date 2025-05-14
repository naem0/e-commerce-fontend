"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

const CartContext = createContext({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartItemCount: () => 0,
})

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage or API on mount
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true)

      try {
        if (session?.user) {
          // If user is logged in, fetch cart from API
          const response = await fetch("/api/cart")

          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setCart(data.cart.items || [])
            }
          }
        } else {
          // If user is not logged in, load from localStorage
          const savedCart = localStorage.getItem("cart")
          if (savedCart) {
            setCart(JSON.parse(savedCart))
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [session])

  // Save cart to localStorage or API when it changes
  useEffect(() => {
    if (isLoading) return

    const saveCart = async () => {
      try {
        if (session?.user) {
          // If user is logged in, save cart to API
          await fetch("/api/cart", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ items: cart }),
          })
        } else {
          // If user is not logged in, save to localStorage
          localStorage.setItem("cart", JSON.stringify(cart))
        }
      } catch (error) {
        console.error("Error saving cart:", error)
      }
    }

    saveCart()
  }, [cart, session, isLoading])

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      // Check if product is already in cart
      const existingItemIndex = cart.findIndex((item) => item.product._id === product._id)

      if (existingItemIndex !== -1) {
        // If product is already in cart, update quantity
        const updatedCart = [...cart]
        updatedCart[existingItemIndex].quantity += quantity
        setCart(updatedCart)
      } else {
        // If product is not in cart, add it
        setCart([...cart, { product, quantity }])
      }

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      })
    }
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    try {
      const updatedCart = cart.filter((item) => item.product._id !== productId)
      setCart(updatedCart)

      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart.",
      })
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      })
    }
  }

  // Update cart item quantity
  const updateCartItemQuantity = (productId, quantity) => {
    try {
      if (quantity <= 0) {
        // If quantity is 0 or less, remove item from cart
        removeFromCart(productId)
        return
      }

      const updatedCart = cart.map((item) => (item.product._id === productId ? { ...item, quantity } : item))
      setCart(updatedCart)
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        title: "Error",
        description: "Failed to update cart.",
        variant: "destructive",
      })
    }
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    })
  }

  // Calculate cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price
      return total + price * item.quantity
    }, 0)
  }

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
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
