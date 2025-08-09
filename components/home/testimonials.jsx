"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Create testimonial service
const testimonialService = {
  getTestimonials: async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`)
      const data = await response.json()
      return { success: true, testimonials: data }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      return { success: false, message: "Failed to fetch testimonials" }
    }
  },
}

// Testimonials section designs that admin can choose from
const testimonialDesigns = [
  {
    id: "testimonials-1",
    component: ({ testimonials }) => (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              What Our Customers Say
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Don't just take our word for it. Read reviews from our satisfied customers.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {testimonials?.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={ testimonial?.avatar ? process.env.NEXT_PUBLIC_API_URL + testimonial.avatar : "/placeholder.svg?height=40&width=40"}
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
    component: ({ testimonials }) => (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Customer Testimonials
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Hear from our happy customers
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
                            src={testimonial?.avatar ? process.env.NEXT_PUBLIC_API_URL + testimonial.avatar : "/placeholder.svg?height=48&width=48"}
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
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeDesign, setActiveDesign] = useState("testimonials-1")

  useEffect(() => {
    // Fetch testimonials from the backend
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        const response = await testimonialService.getTestimonials()

        if (response.success) {
          setTestimonials(response.testimonials)
        } else {
          setError(response.message || "Failed to fetch testimonials")
          // Fallback to empty array if fetch fails
          setTestimonials([])
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error)
        setError("An error occurred while fetching testimonials")
        // Fallback to empty array if fetch fails
        setTestimonials([])
      } finally {
        setLoading(false)
      }
    }

    // Fetch active design from site settings (in a real app)
    const fetchDesign = async () => {
      try {
        // This would be an API call in a real application
        // const response = await settingsService.getSiteSettings()
        // setActiveDesign(response.settings.testimonialsDesign || "testimonials-1")

        // For demo purposes, we'll just use a default
        setActiveDesign("testimonials-1")
      } catch (error) {
        console.error("Error fetching design:", error)
        // Default to first design if fetch fails
        setActiveDesign("testimonials-1")
      }
    }

    fetchTestimonials()
    fetchDesign()
  }, [])

  if (loading) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-8" />
            <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="flex mb-2 space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-4 w-4 rounded-full" />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error && testimonials.length === 0) {
    // If there's an error and no testimonials, don't show the section
    return null
  }

  // If there are no testimonials but no error, don't show the section
  if (testimonials.length === 0) {
    return null
  }

  const ActiveTestimonialsComponent =
    testimonialDesigns.find((design) => design.id === activeDesign)?.component || testimonialDesigns[0].component

  return <ActiveTestimonialsComponent testimonials={testimonials} />
}
