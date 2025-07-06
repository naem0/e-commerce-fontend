"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { getProductById } from "@/services/product.service"
import { formatPrice, getErrorMessage } from "@/services/utils"

export default function ProductPage() {
  const { id } = useParams()
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await getProductById(id)
        setProduct(response.product)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setAddingToCart(true)
      await addToCart(product._id, quantity)

      toast({
        title: t("product.addedToCart") || "Added to Cart",
        description: `${product.name} (${quantity}) ${t("product.addedToCartDesc") || "has been added to your cart"}`,
      })
    } catch (err) {
      toast({
        title: t("product.addToCartError") || "Error",
        description: getErrorMessage(err),
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return

    try {
      setAddingToCart(true)
      await addToCart(product._id, quantity)
      router.push("/checkout")
    } catch (err) {
      toast({
        title: t("product.buyNowError") || "Error",
        description: getErrorMessage(err),
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>{t("product.notFound") || "Product not found"}</p>
        </div>
      </div>
    )
  }

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
            <Image
              src={product.images?.[activeImage] || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 cursor-pointer rounded-md border ${
                    activeImage === index ? "border-primary" : "border-gray-200"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                {product.rating?.toFixed(1) || "0.0"} ({product.numReviews || 0} {t("product.reviews") || "reviews"})
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {product.salePrice ? (
              <>
                <span className="text-3xl font-bold">{formatPrice(product.salePrice)}</span>
                <span className="text-lg text-gray-500 line-through">{formatPrice(product.price)}</span>
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                  {discountPercentage}% {t("product.off") || "OFF"}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              {t("product.availability") || "Availability"}:{" "}
              <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                {product.stock > 0
                  ? `${t("product.inStock") || "In Stock"} (${product.stock})`
                  : t("product.outOfStock") || "Out of Stock"}
              </span>
            </p>
            {product.brand && (
              <p className="text-sm text-gray-500">
                {t("product.brand") || "Brand"}: <span className="font-medium">{product.brand.name}</span>
              </p>
            )}
            {product.category && (
              <p className="text-sm text-gray-500">
                {t("product.category") || "Category"}: <span className="font-medium">{product.category.name}</span>
              </p>
            )}
          </div>

          <div className="border-t border-b py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || product.stock <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || product.stock <= 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || addingToCart}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("product.adding") || "Adding..."}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {t("product.addToCart") || "Add to Cart"}
                  </>
                )}
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleBuyNow}
                disabled={product.stock <= 0 || addingToCart}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("product.buying") || "Buying..."}
                  </>
                ) : (
                  t("product.buyNow") || "Buy Now"
                )}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">{t("product.description") || "Description"}</TabsTrigger>
              <TabsTrigger value="specifications">{t("product.specifications") || "Specifications"}</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {product.specifications ? (
                      Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium">{key}</span>
                          <span className="col-span-2">{value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">{t("product.noSpecifications") || "No specifications available"}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}