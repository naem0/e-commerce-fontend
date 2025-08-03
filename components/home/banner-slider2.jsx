// app/components/BannerSliderClient.jsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SideCategoryMenu } from "@/components/side-category-menu"
import Image from "next/image"

export default function BannerSlider2({ banners, design, settings }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(nextSlide, 5000)
      return () => clearInterval(interval)
    }
  }, [banners])

  return (
    <section className="relative w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="hidden lg:block h-[400px] md:h-[500px] overflow-hidden">
            <SideCategoryMenu className="h-full" />
          </div>
          <div className="lg:col-span-3 relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            {banners.map((banner, index) => {
              let imageUrl = banner.image.startsWith("/uploads")
                ? `${process.env.NEXT_PUBLIC_API_URL}${banner.image}`
                : banner.image

              return (
                <div
                  key={banner._id}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === currentSlide
                      ? "opacity-100 translate-x-0"
                      : index < currentSlide
                        ? "opacity-0 -translate-x-full"
                        : "opacity-0 translate-x-full"
                    }`}
                  style={{
                    backgroundColor: banner.backgroundColor || "#f8fafc",
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="h-full flex items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full px-6">
                      <div className="space-y-4" style={{ color: banner.textColor || "#1e293b" }}>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-primary-custom">
                          {banner.title}
                        </h1>
                        {banner.subtitle && (
                          <h2 className="text-xl md:text-2xl font-semibold opacity-90">{banner.subtitle}</h2>
                        )}
                        {banner.description && (
                          <p className="text-base md:text-lg opacity-80 max-w-md">{banner.description}</p>
                        )}
                        <Button
                          variant="default"
                          size="lg"
                          className="text-lg px-8 py-3 mt-6"
                          style={{
                            backgroundColor: banner.textColor ?? "",
                            color: banner.backgroundColor ?? "",
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

            {/* Arrows */}
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

            {/* Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
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
