"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

// Testimonials section designs that admin can choose from
const testimonialDesigns = [
  {
    id: "testimonials-1",
    component: ({ t, testimonials }) => (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {t("testimonials.title") || "What Our Customers Say"}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {t("testimonials.subtitle") ||
                "Don't just take our word for it. Read reviews from our satisfied customers."}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    ),
  },
  {
    id: "testimonials-2",
    component: ({ t, testimonials }) => (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {t("testimonials.title") || "Customer Testimonials"}
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              {t("testimonials.subtitle") || "Hear from our happy customers"}
            </p>
          </div>
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-5xl">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex flex-col justify-between rounded-2xl bg-background p-6 shadow-lg ring-1 ring-muted"
                  >
                    <div>
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-base leading-relaxed">{testimonial.content}</div>
                    </div>
                    <div className="mt-6 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  },
]

export function Testimonials() {
  const { t } = useLanguage()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDesign, setActiveDesign] = useState("testimonials-1")

  useEffect(() => {
    // Fetch testimonials from the backend
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/testimonials")

        if (!response.ok) {
          throw new Error("Failed to fetch testimonials")
        }

        const data = await response.json()
        setTestimonials(data)
      } catch (error) {
        console.error("Error fetching testimonials:", error)
        // Fallback to empty array if fetch fails
        setTestimonials([])
      } finally {
        setLoading(false)
      }
    }

    // Fetch active design from site settings (in a real app)
    const fetchDesign = async () => {
      // This would be an API call in a real application
      // const response = await fetch('/api/site-settings');
      // const data = await response.json();
      // setActiveDesign(data.testimonialsDesign);

      // For demo purposes, we'll just use a default
      setActiveDesign("testimonials-1")
    }

    fetchTestimonials()
    fetchDesign()
  }, [])

  if (loading) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {t("testimonials.title") || "What Our Customers Say"}
            </h2>
            <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-background p-6 rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="mt-1 h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex mb-2 space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const ActiveTestimonialsComponent =
    testimonialDesigns.find((design) => design.id === activeDesign)?.component || testimonialDesigns[0].component

  return <ActiveTestimonialsComponent t={t} testimonials={testimonials} />
}
