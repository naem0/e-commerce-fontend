"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/components/wishlist-provider"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { formatPrice } from "@/services/utils"
import { Loader2, Heart, ShoppingCart, Trash2 } from "lucide-react"

export default function WishlistPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const { wishlist, loading, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [addingToCart, setAddingToCart] = useState({})

  useEffect(() => {
    if (!session) {
      router.push("/auth/login?callbackUrl=/wishlist")
    }
  }, [session, router])

  const handleAddToCart = async (product) => {
    setAddingToCart({ ...addingToCart, [product._id]: true })
    try {
      await addToCart(product._id, 1)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setAddingToCart({ ...addingToCart, [product._id]: false })
    }
  }

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId)
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          {t("wishlist.title") || "My Wishlist"}
        </h1>
        <p className="text-gray-600 mt-2">
          {wishlist.products.length} {t("wishlist.items") || "items in your wishlist"}
        </p>
      </div>

      {wishlist.products.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("wishlist.empty") || "Your wishlist is empty"}</h2>
          <p className="text-gray-600 mb-6">
            {t("wishlist.emptyDesc") || "Start adding products you love to your wishlist"}
          </p>
          <Button onClick={() => router.push("/products")}>{t("wishlist.startShopping") || "Start Shopping"}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.products.map((item) => {
            const product = item.product
            return (
              <Card key={product._id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={product.images?.[0] ? process.env.NEXT_PUBLIC_API_URL + product.images[0] : "/placeholder.svg?height=300&width=300"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => handleRemoveFromWishlist(product._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary" className="text-white bg-black/70">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  {product.category && (
                    <Badge variant="secondary" className="mb-2">
                      {product.category.name}
                    </Badge>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {product.salePrice ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{formatPrice(product.salePrice)}</span>
                          <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0 || addingToCart[product._id]}
                    >
                      {addingToCart[product._id] ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">Added on {new Date(item.addedAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
