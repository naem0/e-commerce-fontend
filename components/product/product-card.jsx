"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShoppingCart, Eye } from "lucide-react"

export function ProductCard({ product,  showDiscount = false, discountPercentage = 0 }) {
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)


  // Calculate discount percentage
  const calculatedDiscountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : discountPercentage

  const finalPrice = product.salePrice || product.price
  const originalPrice = product.price

    const handleAddToCart = async (product) => {
    if (!product || !product._id) {
      console.error("Invalid product data:", product)
      return
    }
    try {
      setLoading(true)
      await addToCart(product._id, 1)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images?.length > 0 ? process.env.NEXT_PUBLIC_API_URL + product.images[0] : "/placeholder.svg?height=48&width=48"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          {calculatedDiscountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
              -{calculatedDiscountPercentage}%
            </Badge>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
          {showDiscount && discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">Flash Sale</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium line-clamp-2 min-h-[3rem]">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="font-bold">${finalPrice.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
                </>
              ) : (
                <span className="font-bold">${finalPrice.toFixed(2)}</span>
              )}
            </div>
            {product.rating && (
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/products/${product.slug}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={(e) => { e.preventDefault(); handleAddToCart(product) }}
          disabled={loading || product.stock <= 0}
          data-testid="add-to-cart-button"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
