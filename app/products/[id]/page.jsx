"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Minus, Plus, ShoppingCart, Star, StarHalf, Heart, Flag, ThumbsUp } from "lucide-react"
import { getProductById } from "@/services/product.service"
import { formatPrice, getErrorMessage } from "@/services/utils"

export default function ProductPage() {
  const { id } = useParams()
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [activeTab, setActiveTab] = useState("product")

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

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "Shankar Subbaraman",
      date: "30 December 2022",
      verified: true,
      rating: 5,
      title: "Need to recheck the weight at delivery point",
      content: "Product quality is good. But, weight seemed less than 1kg. Since it is being sent in open package, there is a possibility of pilferage in between.",
      images: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg"
      ]
    },
    {
      id: 2,
      name: "Robert Thomas",
      date: "29 December 2022",
      verified: true,
      rating: 4,
      title: "Need to recheck the weight at delivery point",
      content: "Product quality is good. But, weight seemed less than 1kg. Since it is being sent in open package, there is a possibility of pilferage in between.",
    },
    {
      id: 3,
      name: "Barbara Tay",
      date: "28 December 2022",
      verified: false,
      rating: 4,
      title: "Need to recheck the weight at delivery point",
      content: "Everytime i ordered from fresh i got greenish yellow bananas just like i wanted so go for it , its happens very rare that u get over riped ones.",
    }
  ]

  const ratingStats = {
    average: 4.1,
    total: 11130,
    breakdown: [
      { stars: 5, percent: 53 },
      { stars: 4, percent: 22 },
      { stars: 3, percent: 14 },
      { stars: 2, percent: 5 },
      { stars: 1, percent: 7 }
    ]
  }

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb */}
      <div className="mt-4">
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm">
            <li className="text-gray-500">
              <a href="#">{t("product.home") || "Home"}</a>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-500">
              <a href="#">{product.category?.name || t("product.category") || "Category"}</a>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-primary" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Product Section */}
      <section className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
              <Image
                src={product.images?.[activeImage] || "/placeholder.svg"}
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
                    className={`relative h-20 w-20 flex-shrink-0 cursor-pointer rounded-md border ${
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
              <a href="#" className="mb-4 block text-gray-500">{product.category?.name || t("product.category") || "Category"}</a>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => {
                    const starValue = i + 1
                    return (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          starValue <= Math.floor(product.rating || 0) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : starValue - 0.5 <= (product.rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                        }`}
                      />
                    )
                  })}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {product.rating?.toFixed(1) || "0.0"} ({product.numReviews || 0} {t("product.reviews") || "reviews"})
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-dark">{formatPrice(product.salePrice)}</span>
                  <span className="text-lg text-gray-500 line-through">{formatPrice(product.price)}</span>
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                    {discountPercentage}% {t("product.off") || "OFF"}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-dark">{formatPrice(product.price)}</span>
              )}
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="mb-5">
              <button type="button" className="btn btn-outline-secondary mr-2">250g</button>
              <button type="button" className="btn btn-outline-secondary mr-2">500g</button>
              <button type="button" className="btn btn-outline-secondary">1kg</button>
            </div>

            <div className="mb-4">
              <div className="flex items-center">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || product.stock <= 0}
                  className="border p-2 rounded-l-md hover:bg-gray-100 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  min="1"
                  max={product.stock}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    if (value >= 1 && value <= product.stock) {
                      setQuantity(value)
                    }
                  }}
                  className="w-12 text-center border-t border-b py-2"
                />
                <button 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  className="border p-2 rounded-r-md hover:bg-gray-100 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <Button 
                onClick={handleAddToCart} 
                disabled={product.stock <= 0 || addingToCart}
                className="w-full"
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
              <div className="flex space-x-2">
                <Button variant="outline" className="p-2">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="p-2">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div>
              <table className="table-auto w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-2 text-gray-500">{t("product.code") || "Product Code"}:</td>
                    <td className="py-2">{product.code || "FBB00255"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500">{t("product.availability") || "Availability"}:</td>
                    <td className={`py-2 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                      {product.stock > 0
                        ? t("product.inStock") || "In Stock"
                        : t("product.outOfStock") || "Out of Stock"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500">{t("product.type") || "Type"}:</td>
                    <td className="py-2">{product.category?.name || t("product.category") || "Category"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500">{t("product.shipping") || "Shipping"}:</td>
                    <td className="py-2">
                      <small>
                        01 day shipping. <span className="text-muted">(Free pickup today)</span>
                      </small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8">
              <div className="dropdown">
                <Button variant="outline" className="flex items-center">
                  {t("product.share") || "Share"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="mt-14">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="product">{t("product.details") || "Product Details"}</TabsTrigger>
            <TabsTrigger value="information">{t("product.information") || "Information"}</TabsTrigger>
            <TabsTrigger value="reviews">{t("product.reviews") || "Reviews"}</TabsTrigger>
          </TabsList>

          {/* Product Details Tab */}
          <TabsContent value="product" className="mt-8">
            <div className="space-y-6">
              <div>
                <h4 className="mb-3">{t("product.nutrientValue") || "Nutrient Value & Benefits"}</h4>
                <p className="mb-0">
                  {product.description || t("product.defaultDescription") || 
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi, tellus iaculis urna bibendum in lacus, integer."}
                </p>
              </div>
              <div>
                <h5 className="mb-1">{t("product.storageTips") || "Storage Tips"}</h5>
                <p className="mb-0">
                  {t("product.defaultStorageTips") || 
                  "Nisi, tellus iaculis urna bibendum in lacus, integer. Id imperdiet vitae varius sed magnis eu nisi nunc sit."}
                </p>
              </div>
              <div>
                <h5 className="mb-1">{t("product.unit") || "Unit"}</h5>
                <p className="mb-0">3 {t("product.units") || "units"}</p>
              </div>
              <div>
                <h5 className="mb-1">{t("product.seller") || "Seller"}</h5>
                <p className="mb-0">{product.seller || "DMart Pvt. LTD"}</p>
              </div>
              <div>
                <h5 className="mb-1">{t("product.disclaimer") || "Disclaimer"}</h5>
                <p className="mb-0">
                  {t("product.defaultDisclaimer") || 
                  "Image shown is a representation and may slightly vary from the actual product. Every effort is made to maintain accuracy of all information displayed."}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Information Tab */}
          <TabsContent value="information" className="mt-8">
            <div className="space-y-6">
              <h4 className="mb-4">{t("product.details") || "Details"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <table className="table-auto w-full">
                  <tbody>
                    <tr className="border-b">
                      <th className="text-left py-3">{t("product.weight") || "Weight"}:</th>
                      <td className="py-3">1000 {t("product.grams") || "Grams"}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="text-left py-3">{t("product.ingredientType") || "Ingredient Type"}:</th>
                      <td className="py-3">{t("product.vegetarian") || "Vegetarian"}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="text-left py-3">{t("product.brand") || "Brand"}:</th>
                      <td className="py-3">{product.brand?.name || "Dmart"}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="text-left py-3">{t("product.packageQuantity") || "Item Package Quantity"}:</th>
                      <td className="py-3">1</td>
                    </tr>
                  </tbody>
                </table>
                <table className="table-auto w-full">
                  <tbody>
                    <tr className="border-b">
                      <th className="text-left py-3">ASIN:</th>
                      <td className="py-3">SB0025UJ75W</td>
                    </tr>
                    <tr className="border-b">
                      <th className="text-left py-3">{t("product.bestSellersRank") || "Best Sellers Rank"}:</th>
                      <td className="py-3">#2 in {product.category?.name || t("product.category") || "Category"}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="text-left py-3">{t("product.dateFirstAvailable") || "Date First Available"}:</th>
                      <td className="py-3">30 April 2022</td>
                    </tr>
                    <tr className="border-b">
                      <th className="text-left py-3">{t("product.itemWeight") || "Item Weight"}:</th>
                      <td className="py-3">500g</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <div className="mb-5">
                  <h4 className="mb-3">{t("product.customerReviews") || "Customer reviews"}</h4>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => {
                        const starValue = i + 1
                        return (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              starValue <= Math.floor(ratingStats.average) 
                                ? "text-yellow-400 fill-yellow-400" 
                                : starValue - 0.5 <= ratingStats.average
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                            }`}
                          />
                        )
                      })}
                    </div>
                    <span className="ms-3">{ratingStats.average.toFixed(1)} {t("product.outOf5") || "out of 5"}</span>
                  </div>
                  <small className="text-gray-500">{ratingStats.total.toLocaleString()} {t("product.globalRatings") || "global ratings"}</small>
                </div>

                <div className="space-y-3 mb-8">
                  {ratingStats.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="text-nowrap me-3 text-muted">
                        <span className="d-inline-block align-middle text-muted">{item.stars}</span>
                        <Star className="ms-1 h-4 w-4 inline text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="w-full">
                        <div className="progress bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="progress-bar bg-yellow-400 h-1.5 rounded-full" 
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-muted ms-3">{item.percent}%</span>
                    </div>
                  ))}
                </div>

                <div className="d-grid">
                  <h4>{t("product.reviewThisProduct") || "Review this product"}</h4>
                  <p className="mb-0 text-sm text-gray-500">
                    {t("product.shareYourThoughts") || "Share your thoughts with other customers."}
                  </p>
                  <Button variant="outline" className="mt-4 text-gray-500">
                    {t("product.writeReview") || "Write the Review"}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="flex justify-between items-center mb-8">
                  <h4>{t("product.reviews") || "Reviews"}</h4>
                  <select className="form-select border rounded-md px-3 py-1.5 text-sm">
                    <option selected="">{t("product.topReviews") || "Top Reviews"}</option>
                    <option value="Most Recent">{t("product.mostRecent") || "Most Recent"}</option>
                  </select>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex">
                        <div className="rounded-full bg-gray-200 h-10 w-10 flex-shrink-0"></div>
                        <div className="ms-5">
                          <h6 className="mb-1">{review.name}</h6>
                          <p className="text-sm text-gray-500">
                            <span>{review.date}</span>
                            {review.verified ? (
                              <span className="ms-3 text-primary font-bold">{t("product.verifiedPurchase") || "Verified Purchase"}</span>
                            ) : (
                              <span className="ms-3 text-red-600 font-bold">{t("product.unverifiedPurchase") || "Unverified Purchase"}</span>
                            )}
                          </p>
                          <div className="mb-2">
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
                            <span className="ms-3 font-bold">{review.title}</span>
                          </div>
                          <p className="text-gray-700">{review.content}</p>
                          
                          {review.images && review.images.length > 0 && (
                            <div className="flex mt-3 space-x-2">
                              {review.images.map((img, idx) => (
                                <div key={idx} className="border rounded-md overflow-hidden h-16 w-16">
                                  <Image
                                    src={img}
                                    alt={`Review image ${idx + 1}`}
                                    width={64}
                                    height={64}
                                    className="object-cover h-full w-full"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex justify-end mt-4 space-x-4">
                            <Button variant="ghost" className="text-gray-500 p-0">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {t("product.helpful") || "Helpful"}
                            </Button>
                            <Button variant="ghost" className="text-gray-500 p-0">
                              <Flag className="h-4 w-4 mr-1" />
                              {t("product.reportAbuse") || "Report abuse"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" className="text-gray-500">
                    {t("product.readMoreReviews") || "Read More Reviews"}
                  </Button>
                </div>

                {/* Review Form */}
                <div className="mt-10">
                  <h3 className="mb-5">{t("product.createReview") || "Create Review"}</h3>
                  
                  <div className="border-b py-4 mb-4">
                    <h4 className="mb-3">{t("product.overallRating") || "Overall rating"}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-gray-300" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-b py-4 mb-4">
                    <h4 className="mb-0">{t("product.rateFeatures") || "Rate Features"}</h4>
                    <div className="my-5">
                      <h5>{t("product.quality") || "Quality"}</h5>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-gray-300" />
                        ))}
                      </div>
                    </div>
                    <div className="my-5">
                      <h5>{t("product.valueForMoney") || "Value for money"}</h5>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-gray-300" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b py-4 mb-4">
                    <h5>{t("product.addHeadline") || "Add a headline"}</h5>
                    <input 
                      type="text" 
                      className="w-full border rounded-md px-3 py-2 mt-2" 
                      placeholder={t("product.headlinePlaceholder") || "What's most important to know"}
                    />
                  </div>
                  
                  <div className="border-b py-4 mb-4">
                    <h5>{t("product.addMedia") || "Add a photo or video"}</h5>
                    <p className="text-sm text-gray-500">
                      {t("product.mediaHelpText") || "Shoppers find images and videos more helpful than text alone."}
                    </p>
                    <div className="border-2 border-dashed rounded-md p-4 mt-4 text-center">
                      <p>{t("product.dropFilesHere") || "Drop files here to upload"}</p>
                    </div>
                  </div>
                  
                  <div className="py-4 mb-4">
                    <h5>{t("product.addWrittenReview") || "Add a written review"}</h5>
                    <textarea 
                      className="w-full border rounded-md px-3 py-2 mt-2 h-32" 
                      placeholder={t("product.reviewPlaceholder") || "What did you like or dislike? What did you use this product for?"}
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      {t("product.submitReview") || "Submit Review"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}