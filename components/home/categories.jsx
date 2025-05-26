"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories } from "@/services/category.service"
import { useSiteSettings } from "../site-settings-provider"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Layers } from "lucide-react"

export function Categories() {
  const { t } = useLanguage()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { settings } = useSiteSettings()
  const [catagoryDesign, setCatagoryDesign] = useState("catagory-2")

  useEffect(() => {
    if (settings && settings.catagoryDesign) {
      setCatagoryDesign(settings.catagoryDesign)
    }
  }, [settings])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const result = await getCategories({ limit: 8 })

        if (result.success) {
          setCategories(result.categories)
        } else {
          throw new Error(result.message || "Failed to fetch categories")
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (error) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("categories.title") || "Shop by Category"}</h2>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (catagoryDesign === "catagory-1") {
    return (
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Layers className="text-primary h-6 w-6" />
              <h3 className="text-xl font-semibold ml-3">
                {t("categories.title") || "Shop by Categories"}
              </h3>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-20 w-20 mx-auto rounded-full" />
                  <Skeleton className="h-4 w-16 mx-auto mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                slidesToScroll: "auto",
              }}
              className="w-full"
            >
              <div className="relative">
                <CarouselContent className="-ml-2">
                  {categories.map((category) => (
                    <CarouselItem key={category._id} className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8 pl-2">
                      <Link href={`/products?category=${category._id}`}>
                        <Card className="border-0 shadow-none hover:shadow-md transition-all hover:-translate-y-1 h-full py-4">
                          <CardContent className="p-2 flex flex-col items-center justify-center h-full">
                            <div className="my-4 mx-auto">
                              {category.icon ? (
                                <div
                                  className="h-14 w-14 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"
                                  dangerouslySetInnerHTML={{ __html: category.icon }}
                                />
                              ) : (
                                <div className="h-14 w-14 mx-auto p">
                                  <Layers className="h-14 w-14 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-medium truncate w-full text-center">
                              {category.name}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4" />
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4" />
              </div>
            </Carousel>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t("categories.title") || "Shop by Category"}
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4 text-center">
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category._id} href={`/products?category=${category._id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-40 w-full">
                    <Image
                      src={category.image || "/placeholder.svg?height=160&width=256"}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.productCount} {t("categories.products") || "products"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
