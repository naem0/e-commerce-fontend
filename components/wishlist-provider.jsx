"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { getWishlist, addToWishlist, removeFromWishlist } from "@/services/wishlist.service"
import { useToast } from "@/hooks/use-toast"

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [wishlist, setWishlist] = useState({ products: [] })
  const [loading, setLoading] = useState(false)

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (session?.user) {
      fetchWishlist()
    } else {
      setWishlist({ products: [] })
    }
  }, [session])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await getWishlist()
      if (response.success) {
        setWishlist(response.wishlist)
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlistHandler = async (productId) => {
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      })
      return false
    }

    try {
      const response = await addToWishlist(productId)
      if (response.success) {
        setWishlist(response.wishlist)
        toast({
          title: "Added to Wishlist",
          description: "Product has been added to your wishlist",
        })
        return true
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to wishlist",
        variant: "destructive",
      })
      return false
    }
  }

  const removeFromWishlistHandler = async (productId) => {
    try {
      const response = await removeFromWishlist(productId)
      if (response.success) {
        setWishlist(response.wishlist)
        toast({
          title: "Removed from Wishlist",
          description: "Product has been removed from your wishlist",
        })
        return true
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from wishlist",
        variant: "destructive",
      })
      return false
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.products.some((item) => item.product._id === productId)
  }

  const getWishlistCount = () => {
    return wishlist.products.length
  }

  const value = {
    wishlist,
    loading,
    addToWishlist: addToWishlistHandler,
    removeFromWishlist: removeFromWishlistHandler,
    isInWishlist,
    getWishlistCount,
    fetchWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
