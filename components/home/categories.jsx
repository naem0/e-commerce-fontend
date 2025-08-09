import Link from "next/link"
import Image from "next/image"
import { getCategories } from "@/services/category.service"
import { Card, CardContent } from "@/components/ui/card"
import { Layers } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { getSiteSettings } from "@/services/settings.service"

export default async function Categories() {
  let categories = []
  let error = null
  let catagoryDesign = "catagory-2"

  try {
    const result = await getCategories({ limit: 8 })

    if (result.success) {
      categories = result.categories
    } else {
      throw new Error(result.message || "Failed to fetch categories")
    }
  } catch (err) {
    console.error("Error fetching categories:", err)
    error = err.message
  }

  // get site settings server-side
  const settings = await getSiteSettings()
  if (settings?.catagoryDesign) {
    catagoryDesign = settings.catagoryDesign
  }


  if (error) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">{"Shop by Category"}</h2>
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
              <Layers className="text-primary-customh-6 w-6" />
              <h3 className="text-xl font-semibold ml-3">
                {"Shop by Categories"}
              </h3>
            </div>
          </div>

          <Carousel
            opts={{ align: "start", slidesToScroll: "auto" }}
            className="w-full"
          >
            <div className="relative">
              <CarouselContent className="-ml-2">
                {categories.map((category) => (
                  <CarouselItem
                    key={category._id}
                    className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8 pl-2"
                  >
                    <Link href={`/categories/${category.slug}`}>
                      <Card className="border-0 shadow-none hover:shadow-md transition-all hover:-translate-y-1 h-full py-4">
                        <CardContent className="p-2 flex flex-col items-center justify-center h-full">
                          <div className="my-4 mx-auto">
                            {category.icon ? (
                              <div
                                className="h-14 w-14 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: category.icon }}
                              />
                            ) : (
                              <div className="h-14 w-14 mx-auto">
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
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {"Shop by Category"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40 w-full">
                  <Image
                    src={
                      category.image
                        ? process.env.NEXT_PUBLIC_API_URL + category.image
                        : "/placeholder.svg?height=160&width=256"
                    }
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category?.productCount} {"products"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
