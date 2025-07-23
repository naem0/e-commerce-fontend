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
import { getProductBySlug } from "@/services/product.service"
import { formatPrice, getErrorMessage } from "@/services/utils"

export default function ProductPageClient() {
  const { slug } = useParams()
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
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState({})

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await getProductBySlug(slug)
        setProduct(response.product)

        // Set default variant if product has variations
        if (response.product?.hasVariations && response.product.variants?.length > 0) {
          const defaultVariant = response.product.variants.find((v) => v.isDefault) || response.product.variants[0]
          setSelectedVariant(defaultVariant)

          // Set default options
          const defaultOptions = {}
          defaultVariant.options.forEach((option) => {
            defaultOptions[option.type] = option.value
          })
          setSelectedOptions(defaultOptions)
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const handleQuantityChange = (amount) => {
    const maxStock = selectedVariant ? selectedVariant.stock : product?.stock || 0
    const newQuantity = quantity + amount
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity)
    }
  }

  const handleVariantOptionChange = (type, value) => {
    const newOptions = { ...selectedOptions, [type]: value }
    setSelectedOptions(newOptions)

    // Find matching variant
    const matchingVariant = product.variants.find((variant) => {
      return variant.options.every((option) => newOptions[option.type] === option.value)
    })

    if (matchingVariant) {
      setSelectedVariant(matchingVariant)
      setQuantity(1) // Reset quantity when variant changes
    }
  }

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.comparePrice && selectedVariant.comparePrice > selectedVariant.price
        ? selectedVariant.price
        : selectedVariant.price
    }
    return product?.comparePrice && product.comparePrice > product.price ? product.price : product.price
  }

  const getComparePrice = () => {
    if (selectedVariant) {
      return selectedVariant.comparePrice && selectedVariant.comparePrice > selectedVariant.price
        ? selectedVariant.comparePrice
        : null
    }
    return product?.comparePrice && product.comparePrice > product.price ? product.comparePrice : null
  }

  const getCurrentStock = () => {
    return selectedVariant ? selectedVariant.stock : product?.stock || 0
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setAddingToCart(true)
      const productId = product._id
      const variantId = selectedVariant?._id

      await addToCart(productId, quantity, variantId)

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
      const productId = product._id
      const variantId = selectedVariant?._id

      await addToCart(productId, quantity, variantId)
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

  const currentPrice = getCurrentPrice()
  const comparePrice = getComparePrice()
  const currentStock = getCurrentStock()
  const discountPercentage = comparePrice ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="/" className="text-gray-700 hover:text-primary">
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <a href="/products" className="text-gray-700 hover:text-primary">
                Products
              </a>
            </div>
          </li>
          {product.category && (
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <a href={`/categories/${product.category.slug}`} className="text-gray-700 hover:text-primary">
                  {product.category.name}
                </a>
              </div>
            </li>
          )}
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
            <Image
              src={
                selectedVariant?.images?.length > 0
                  ? `${process.env.NEXT_PUBLIC_API_URL}${selectedVariant.images[activeImage]}`
                  : product.images?.length > 0
                    ? `${process.env.NEXT_PUBLIC_API_URL}${product.images[activeImage]}`
                    : "/placeholder.svg?height=600&width=600"
              }
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Image thumbnails */}
          {((selectedVariant?.images?.length > 0 ? selectedVariant.images : product.images) || []).length > 1 && (
            <div className="flex space-x-2 overflow-auto pb-2">
              {(selectedVariant?.images?.length > 0 ? selectedVariant.images : product.images).map((image, index) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 cursor-pointer rounded-md border ${
                    activeImage === index ? "border-primary" : "border-gray-200"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
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
            {comparePrice ? (
              <>
                <span className="text-3xl font-bold">{formatPrice(currentPrice)}</span>
                <span className="text-lg text-gray-500 line-through">{formatPrice(comparePrice)}</span>
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                  {discountPercentage}% {t("product.off") || "OFF"}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">{formatPrice(currentPrice)}</span>
            )}
          </div>

          {/* Product variations */}
          {product.hasVariations && product.variationTypes?.length > 0 && (
            <div className="space-y-4">
              {product.variationTypes.map((variationType) => (
                <div key={variationType.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{variationType.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {variationType.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleVariantOptionChange(variationType.name, option.value)}
                        className={`px-3 py-2 border rounded-md text-sm ${
                          selectedOptions[variationType.name] === option.value
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              {t("product.availability") || "Availability"}:{" "}
              <span className={currentStock > 0 ? "text-green-600" : "text-red-600"}>
                {currentStock > 0
                  ? `${t("product.inStock") || "In Stock"} (${currentStock})`
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
            {selectedVariant && (
              <p className="text-sm text-gray-500">
                SKU: <span className="font-medium">{selectedVariant.sku}</span>
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
                  disabled={quantity <= 1 || currentStock <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= currentStock || currentStock <= 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={handleAddToCart}
                disabled={currentStock <= 0 || addingToCart}
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
                disabled={currentStock <= 0 || addingToCart}
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">{t("product.description") || "Description"}</TabsTrigger>
              <TabsTrigger value="specifications">{t("product.specifications") || "Specifications"}</TabsTrigger>
              <TabsTrigger value="reviews">{t("product.reviews") || "Reviews"}</TabsTrigger>
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
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{review.name}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">{t("product.noReviews") || "No reviews yet"}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
