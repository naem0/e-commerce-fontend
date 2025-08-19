"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { formatPrice, getErrorMessage } from "@/services/utils"

export default function ProductPageClient({ product }) {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  // const [product, setProduct] = useState(null)
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState({})

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
        title: "Added to Cart",
        description: `${product.name} (${quantity}) has been added to your cart`,
      })
    } catch (err) {
      toast({
        title: "Error",
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
        title: "Error",
        description: getErrorMessage(err),
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }

  // if (loading) {
  //   return (
  //     <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
  //       <Loader2 className="h-12 w-12 animate-spin text-primary-custom" />
  //     </div>
  //   )
  // }

  // if (error) {
  //   return (
  //     <div className="container mx-auto px-4 py-16">
  //       <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
  //         <p>{error}</p>
  //       </div>
  //     </div>
  //   )
  // }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Product not found</p>
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
            <a href="/" className="text-gray-700 hover:text-primary-custom">
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <a href="/products" className="text-gray-700 hover:text-primary-custom">
                Products
              </a>
            </div>
          </li>
          {product.category && (
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <a href={`/categories/${product.category.slug}`} className="text-gray-700 hover:text-primary-custom">
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
                  className={`relative h-20 w-20 cursor-pointer rounded-md border ${activeImage === index ? "border-primary" : "border-gray-200"
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
                    className={`h-5 w-5 ${i < Math.round(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                {product.rating?.toFixed(1) || "0.0"} ({product.numReviews || 0} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {comparePrice ? (
              <>
                <span className="text-3xl font-bold">{formatPrice(currentPrice)}</span>
                <span className="text-lg text-gray-500 line-through">{formatPrice(comparePrice)}</span>
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                  {discountPercentage}% OFF
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
                        className={`px-3 py-2 border rounded-md text-sm ${selectedOptions[variationType.name] === option.value
                          ? "border-primary bg-primary-custom text-white"
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
              Availability:{" "}
              <span className={currentStock > 0 ? "text-green-600" : "text-red-600"}>
                {currentStock > 0
                  ? `In Stock (${currentStock})`
                  : "Out of Stock"}
              </span>
            </p>
            {product.brand && (
              <p className="text-sm text-gray-500">
                Brand: <span className="font-medium">{product.brand.name}</span>
              </p>
            )}
            {product.category && (
              <p className="text-sm text-gray-500">
                Category: <span className="font-medium">{product.category.name}</span>
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
                variant="default"
                onClick={handleAddToCart}
                disabled={currentStock <= 0 || addingToCart || (product.hasVariations && !selectedVariant)}
              >
                {addingToCart ? (
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
              <Button
                variant="default"
                onClick={handleBuyNow}
                disabled={currentStock <= 0 || addingToCart || (product.hasVariations && !selectedVariant)}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buying...
                  </>
                ) : (
                  "Buy Now"
                )}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
                      <p className="text-gray-500">No specifications available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review, index) => (
                        <div
                          key={index}
                          className="border rounded-2xl p-5 shadow-md bg-white dark:bg-gray-900 dark:border-gray-800 transition"
                        >
                          {/* Header: User info + Date */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {/* Avatar */}
                              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow-md">
                                {review.user?.name?.[0]?.toUpperCase() || "U"}
                              </div>

                              {/* Name + Date */}
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                  {review.user?.name || "Anonymous"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {/* Formatted date */}
                                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>

                              {/* Verified badge */}
                              {review.verified && (
                                <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                                  ✔ Verified
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Rating + Title */}
                          <div className="flex items-center mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                  }`}
                              />
                            ))}
                            {review.title && (
                              <span className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                                {review.title}
                              </span>
                            )}
                          </div>

                          {/* Comment */}
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            {review.comment}
                          </p>

                          {/* Images */}
                          {review.images?.length > 0 && (
                            <div className="flex gap-3 mb-4">
                              {review.images.map((img, i) => (
                                <>
                                {console.log(process.env.NEXT_PUBLIC_API_URL + img)}
                                <img
                                  key={i}
                                  src={process.env.NEXT_PUBLIC_API_URL + img}
                                  loading="lazy"
                                  alt={`review-${i}`}
                                  height={100}
                                  width={100}
                                  className="w-24 h-24 object-cover rounded-lg border dark:border-gray-700 shadow-sm hover:scale-105 transition-transform"
                                />
                                </>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <button className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition">
                              👍 Helpful ({review.helpful})
                            </button>
                            <p className="text-xs">
                              Last updated {new Date(review.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
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
