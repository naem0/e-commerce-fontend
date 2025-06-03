"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShoppingCart, Eye } from "lucide-react"

export function ProductCard({ product, handleAddToCart, showDiscount = false, discountPercentage = 0 }) {
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)


  // Calculate discount percentage
  const calculatedDiscountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : discountPercentage

  const finalPrice = product.salePrice || product.price
  const originalPrice = product.price

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={
              // product.images?.[0] ||
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D" ||
              "/placeholder.svg?height=300&width=300"
            }
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
                {t("product.outOfStock") || "Out of Stock"}
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
          <Link href={`/products/${product._id}`}>
            <Eye className="mr-2 h-4 w-4" />
            {t("product.view") || "View"}
          </Link>
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={(e) => { e.preventDefault(); handleAddToCart(product) }}
          disabled={isLoading || product.stock <= 0}
          data-testid="add-to-cart-button"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
          {t("products.add") || "Add"}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Default export
export default ProductCard
