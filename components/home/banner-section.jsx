"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { useSiteSettings } from "@/components/site-settings-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SideCategoryMenu } from "@/components/side-category-menu"
import { getBanners } from "@/services/banner.service"

export function BannerSection() {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()
  const [bannerDesign, setBannerDesign] = useState("banner-11")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (settings && settings.bannerDesign) {
      setBannerDesign(settings.bannerDesign)
    }
  }, [settings])

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const result = await getBanners({ enabled: true })
        if (result.success && result.banners.length > 0) {
          setBanners(result.banners)
        } else {
          // Use default banners if none are found
          setBanners([
            {
              _id: "default-1",
              title: t("banner.title1") || "Summer Sale 2024",
              subtitle: t("banner.subtitle1") || "Up to 50% off on all items",
              description: t("banner.description1") || "Don't miss out on our biggest sale of the year",
              image: "/placeholder.svg?height=600&width=1200",
              buttonText: t("banner.shopNow") || "Shop Now",
              buttonLink: "/products",
              backgroundColor: "",
              textColor: "",
            },
            {
              _id: "default-2",
              title: t("banner.title2") || "New Collection",
              subtitle: t("banner.subtitle2") || "Fresh styles for the season",
              description: t("banner.description2") || "Discover our latest arrivals and trending products",
              image: "/placeholder.svg?height=600&width=1200",
              buttonText: t("banner.exploreNow") || "Explore Now",
              buttonLink: "/categories",
              backgroundColor: "",
              textColor: "",
            },
            {
              _id: "default-3",
              title: t("banner.title3") || "Free Shipping",
              subtitle: t("banner.subtitle3") || "On orders over $100",
              description: t("banner.description3") || "Fast and reliable delivery to your doorstep",
              image: "/placeholder.svg?height=600&width=1200",
              buttonText: t("banner.orderNow") || "Order Now",
              buttonLink: "/products",
              backgroundColor: "",
              textColor: "",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching banners:", error)
        // Use default banners on error
        setBanners([
          {
            _id: "default-1",
            title: t("banner.title1") || "Summer Sale 2024",
            subtitle: t("banner.subtitle1") || "Up to 50% off on all items",
            description: t("banner.description1") || "Don't miss out on our biggest sale of the year",
            image: "/placeholder.svg?height=600&width=1200",
            buttonText: t("banner.shopNow") || "Shop Now",
            buttonLink: "/products",
            backgroundColor: "",
            textColor: "",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [t])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(nextSlide, 5000)
      return () => clearInterval(interval)
    }
  }, [banners.length])

  // Banner Design 1: Simple Slider with Side Category
  if (bannerDesign === "banner-1") {
    return (
      <section className="relative w-full overflow-hidden bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Side Category Menu - Only visible on desktop */}
            <div className="hidden lg:block h-[400px] md:h-[500px] overflow-hidden">
              <SideCategoryMenu className="h-full" />
            </div>

            {/* Banner Slider */}
            <div className="lg:col-span-3 relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              {banners.map((banner, index) => {
                // Process image URL
                let imageUrl = banner.image
                if (imageUrl && imageUrl.startsWith("/uploads")) {
                  imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`
                }

                return (
                  <div
                    key={banner._id}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                      index === currentSlide
                        ? "opacity-100 translate-x-0"
                        : index < currentSlide
                          ? "opacity-0 -translate-x-full"
                          : "opacity-0 translate-x-full"
                    }`}
                    style={{ backgroundColor: banner.backgroundColor || "#f8fafc" }}
                  >
                    <div className="h-full flex items-center">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full px-6">
                        <div className="space-y-4" style={{ color: banner.textColor || "#1e293b" }}>
                          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{banner.title}</h1>
                          {banner.subtitle && (
                            <h2 className="text-xl md:text-2xl font-semibold opacity-90">{banner.subtitle}</h2>
                          )}
                          {banner.description && (
                            <p className="text-base md:text-lg opacity-80 max-w-md">{banner.description}</p>
                          )}
                          <Button
                            asChild
                            size="lg"
                            className="text-lg px-8 py-3 mt-6"
                            style={{
                              backgroundColor: banner.textColor || "#1e293b",
                              color: banner.backgroundColor || "#f8fafc",
                            }}
                          >
                            <Link href={banner.buttonLink || "/products"}>{banner.buttonText || "Shop Now"}</Link>
                          </Button>
                        </div>
                        <div className="relative h-[250px] md:h-[400px] order-first md:order-last">
                          <img
                            src={imageUrl || "/placeholder.svg?height=400&width=600"}
                            alt={banner.title}
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=400&width=600"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Navigation Arrows */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-200 shadow-lg z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-200 shadow-lg z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {banners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Banner Design 1: Simple Slider with Side Category
  if (bannerDesign === "banner-11") {
    return (
      <section className="relative w-full overflow-hidden bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Side Category Menu - Only visible on desktop */}
            <div className="hidden lg:block h-[400px] md:h-[500px] overflow-hidden">
              <SideCategoryMenu className="h-full" />
            </div>

            {/* Banner Slider */}
            <div className="lg:col-span-3 relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              {banners.map((banner, index) => {
                // Process image URL
                let imageUrl = banner.image
                if (imageUrl && imageUrl.startsWith("/uploads")) {
                  imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`
                }

                return (
                  <div
                    key={banner._id}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                      index === currentSlide
                        ? "opacity-100 translate-x-0"
                        : index < currentSlide
                          ? "opacity-0 -translate-x-full"
                          : "opacity-0 translate-x-full"
                    }`}
                    style={{ backgroundColor: banner.backgroundColor || "#f8fafc", backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  >
                    <div className="h-full flex items-center">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full px-6">
                        <div className="space-y-4" style={{ color: banner.textColor || "#1e293b" }}>
                          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{banner.title}</h1>
                          {banner.subtitle && (
                            <h2 className="text-xl md:text-2xl font-semibold opacity-90">{banner.subtitle}</h2>
                          )}
                          {banner.description && (
                            <p className="text-base md:text-lg opacity-80 max-w-md">{banner.description}</p>
                          )}
                          <Button
                            asChild
                            size="lg"
                            className="text-lg px-8 py-3 mt-6"
                            style={{
                              backgroundColor: banner.textColor || "#1e293b",
                              color: banner.backgroundColor || "#f8fafc",
                            }}
                          >
                            <Link href={banner.buttonLink || "/products"}>{banner.buttonText || "Shop Now"}</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Navigation Arrows */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition-all duration-200 shadow-lg z-10"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-800" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition-all duration-200 shadow-lg z-10"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-800" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {banners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Banner Design 2: Full Width with Overlay
  if (bannerDesign === "banner-2") {
    const currentBanner = banners[currentSlide] || {
      title: "Welcome to Our Store",
      image: "/placeholder.svg?height=700&width=1600",
    }

    // Process image URL
    let imageUrl = currentBanner.image
    if (imageUrl && imageUrl.startsWith("/uploads")) {
      imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`
    }

    return (
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="space-y-6 text-white max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold">{currentBanner.title}</h1>
            {currentBanner.subtitle && (
              <h2 className="text-2xl md:text-3xl font-semibold opacity-90">{currentBanner.subtitle}</h2>
            )}
            {currentBanner.description && (
              <p className="text-lg opacity-80 max-w-2xl mx-auto">{currentBanner.description}</p>
            )}
            <Button asChild size="lg" className="text-lg px-8 py-6" style={{ backgroundColor: settings?.primaryColor }}>
              <Link href={currentBanner.buttonLink || "/products"}>{currentBanner.buttonText || "Shop Now"}</Link>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    index === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    )
  }

  // Banner Design 3: Split Layout
  if (bannerDesign === "banner-3") {
    return (
      <section className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => {
              // Process image URL
              let imageUrl = banner.image
              if (imageUrl && imageUrl.startsWith("/uploads")) {
                imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`
              }

              return (
                <div
                  key={banner._id}
                  className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden group cursor-pointer"
                  style={{ backgroundColor: banner.backgroundColor || "#f8fafc" }}
                >
                  <img
                    src={imageUrl || "/placeholder.svg?height=400&width=600"}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=400&width=600"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{banner.title}</h3>
                    {banner.subtitle && <p className="text-sm opacity-90 mb-4">{banner.subtitle}</p>}
                    <Button asChild size="sm" className="text-sm" style={{ backgroundColor: settings?.primaryColor }}>
                      <Link href={banner.buttonLink || "/products"}>{banner.buttonText || "Shop Now"}</Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // Default fallback
  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="space-y-6 text-white">
            <h1 className="text-4xl md:text-6xl font-bold">{t("banner.defaultTitle") || "Welcome to Our Store"}</h1>
            <p className="text-xl opacity-90">{t("banner.defaultSubtitle") || "Discover amazing products"}</p>
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100">
              <Link href="/products">{t("banner.shopNow") || "Shop Now"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
