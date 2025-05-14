import { NextResponse } from "next/server"

// Sample testimonials data (in a real app, this would come from a database)
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Customer",
    content:
      "I've been shopping here for years and the quality never disappoints. The customer service is exceptional!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Customer",
    content: "Fast shipping and the products are exactly as described. Will definitely be ordering again.",
    rating: 4,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Customer",
    content: "The variety of products is amazing. I always find what I'm looking for at great prices.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Customer",
    content: "Excellent shopping experience from browsing to delivery. Highly recommend!",
    rating: 5,
  },
  {
    id: 5,
    name: "Sophia Patel",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Customer",
    content: "The website is so easy to navigate and the checkout process is seamless. Great job!",
    rating: 4,
  },
  {
    id: 6,
    name: "James Wilson",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Customer",
    content: "I received my order earlier than expected and everything was perfect. Will shop again!",
    rating: 5,
  },
]

export async function GET() {
  return NextResponse.json(testimonials)
}
