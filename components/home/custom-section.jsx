"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { getProducts } from "@/services/product.service"
import { ProductCard } from "@/components/product/product-card"
import { Clock, Flame, Star, TrendingUp } from "lucide-react"

export function CustomSection({ section }) {
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let productsResult

        switch (section.type) {
          case "best-sellers":
            productsResult = await getProducts({
              sortBy: "sales",
              limit: section.settings.limit || 8,
            })
            break
          case "flash-sale":
            productsResult = await getProducts({
              onSale: true,
              limit: section.settings.limit || 8,
            })
            break
          case "category-best-sellers":
            if (section.settings.categoryId) {
              productsResult = await getProducts({
                category: section.settings.categoryId,
                sortBy: "sales",
                limit: section.settings.limit || 8,
              })
            }
            break
          case "new-arrivals":
            productsResult = await getProducts({
              sortBy: "newest",
              limit: section.settings.limit || 8,
            })
            break
          case "trending":
            productsResult = await getProducts({
              sortBy: "popularity",
              limit: section.settings.limit || 8,
            })
            break
          case "custom-products":
            if (section.settings.productIds && section.settings.productIds.length > 0) {
              productsResult = await getProducts({
                ids: section.settings.productIds,
              })
            }
            break
          default:
            productsResult = await getProducts({ limit: section.settings.limit || 8 })
        }

        if (productsResult?.success) {
          setProducts(productsResult.products || [])
        } else {
          throw new Error(productsResult?.message || "Failed to fetch products")
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (section.enabled) {
      fetchProducts()
    }
  }, [section])

  // Timer for flash sale
  useEffect(() => {
    if (section.type === "flash-sale" && section.settings.endDate && section.settings.showTimer) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const endTime = new Date(section.settings.endDate).getTime()
        const difference = endTime - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          setTimeLeft({ days, hours, minutes, seconds })
        } else {
          setTimeLeft(null)
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [section])

  const handleAddToCart = (product) => {
    addToCart(product, 1)
  }

  const getSectionIcon = () => {
    switch (section.type) {
      case "best-sellers":
        return <Star className="w-6 h-6" />
      case "flash-sale":
        return <Flame className="w-6 h-6" />
      case "new-arrivals":
        return <Clock className="w-6 h-6" />
      case "trending":
        return <TrendingUp className="w-6 h-6" />
      default:
        return null
    }
  }

  const getSectionBadge = () => {
    switch (section.type) {
      case "best-sellers":
        return <Badge variant="secondary">Best Sellers</Badge>
      case "flash-sale":
        return <Badge variant="destructive">Flash Sale</Badge>
      case "new-arrivals":
        return <Badge variant="outline">New Arrivals</Badge>
      case "trending":
        return <Badge variant="default">Trending</Badge>
      default:
        return null
    }
  }

  if (!section.enabled || error) {
    return null
  }

  const sectionStyle = {
    backgroundColor: section.settings.backgroundColor || "#ffffff",
    color: section.settings.textColor || "#000000",
  }

  return (
    <section className="py-12" style={sectionStyle}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {getSectionIcon()}
            <h2 className="text-2xl md:text-3xl font-bold">{section.title}</h2>
            {getSectionBadge()}
          </div>

          {/* Flash Sale Timer */}
          {section.type === "flash-sale" && timeLeft && section.settings.showTimer && (
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
                  {timeLeft.days.toString().padStart(2, "0")}
                </div>
                <div className="text-sm mt-1">Days</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-sm mt-1">Hours</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-sm mt-1">Minutes</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-sm mt-1">Seconds</div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/4 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                showDiscount={section.type === "flash-sale"}
                discountPercentage={section.settings.discountPercentage}
              />
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No products found for this section.</p>
          </div>
        )}
      </div>
    </section>
  )
}
