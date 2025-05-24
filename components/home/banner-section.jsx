"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { useSiteSettings } from "@/components/site-settings-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function BannerSection() {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()
  const [bannerDesign, setBannerDesign] = useState("banner-1")
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (settings && settings.bannerDesign) {
      setBannerDesign(settings.bannerDesign)
    }
  }, [settings])

  // Sample banner data - this would come from your backend
  const banners = [
    {
      id: 1,
      title: t("banner.title1") || "Summer Sale 2024",
      subtitle: t("banner.subtitle1") || "Up to 50% off on all items",
      description: t("banner.description1") || "Don't miss out on our biggest sale of the year",
      image: "/placeholder.svg?height=600&width=1200",
      buttonText: t("banner.shopNow") || "Shop Now",
      buttonLink: "/products",
      backgroundColor: "#f8fafc",
      textColor: "#1e293b",
    },
    {
      id: 2,
      title: t("banner.title2") || "New Collection",
      subtitle: t("banner.subtitle2") || "Fresh styles for the season",
      description: t("banner.description2") || "Discover our latest arrivals and trending products",
      image: "/placeholder.svg?height=600&width=1200",
      buttonText: t("banner.exploreNow") || "Explore Now",
      buttonLink: "/categories",
      backgroundColor: "#1e293b",
      textColor: "#ffffff",
    },
    {
      id: 3,
      title: t("banner.title3") || "Free Shipping",
      subtitle: t("banner.subtitle3") || "On orders over $100",
      description: t("banner.description3") || "Fast and reliable delivery to your doorstep",
      image: "/placeholder.svg?height=600&width=1200",
      buttonText: t("banner.orderNow") || "Order Now",
      buttonLink: "/products",
      backgroundColor: "#10b981",
      textColor: "#ffffff",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  // Banner Design 1: Simple Slider
  if (bannerDesign === "banner-1") {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
            }`}
            style={{ backgroundColor: banner.backgroundColor }}
          >
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
                <div className="space-y-6" style={{ color: banner.textColor }}>
                  <h1 className="text-4xl md:text-6xl font-bold">{banner.title}</h1>
                  <h2 className="text-2xl md:text-3xl font-semibold opacity-90">{banner.subtitle}</h2>
                  <p className="text-lg opacity-80">{banner.description}</p>
                  <Button
                    asChild
                    size="lg"
                    className="text-lg px-8 py-6"
                    style={{ backgroundColor: settings?.primaryColor }}
                  >
                    <Link href={banner.buttonLink}>{banner.buttonText}</Link>
                  </Button>
                </div>
                <div className="relative h-[300px] md:h-[400px]">
                  <img
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>
    )
  }

  // Banner Design 2: Full Width with Overlay
  if (bannerDesign === "banner-2") {
    const currentBanner = banners[currentSlide]
    return (
      <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentBanner.image})` }}>
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="space-y-8 text-white max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold">{currentBanner.title}</h1>
            <h2 className="text-2xl md:text-4xl font-semibold opacity-90">{currentBanner.subtitle}</h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto">{currentBanner.description}</p>
            <Button
              asChild
              size="lg"
              className="text-lg px-12 py-6"
              style={{ backgroundColor: settings?.primaryColor }}
            >
              <Link href={currentBanner.buttonLink}>{currentBanner.buttonText}</Link>
            </Button>
          </div>
        </div>

        {/* Navigation */}
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
      </section>
    )
  }

  // Banner Design 3: Split Layout
  if (bannerDesign === "banner-3") {
    return (
      <section className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden group cursor-pointer"
                style={{ backgroundColor: banner.backgroundColor }}
              >
                <img
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{banner.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{banner.subtitle}</p>
                  <Button asChild size="sm" className="text-sm" style={{ backgroundColor: settings?.primaryColor }}>
                    <Link href={banner.buttonLink}>{banner.buttonText}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default fallback
  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
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
