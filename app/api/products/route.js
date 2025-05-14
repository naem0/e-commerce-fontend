import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ProductAPI } from "@/lib/api"

// Get products
export async function GET(request) {
  try {
    // Get search params from URL
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const featured = searchParams.get("featured")
    const id = searchParams.get("id")
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "10"
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"

    // Call the backend API
    let response

    if (id) {
      // Get a single product
      response = await ProductAPI.getById(id)
      return NextResponse.json(response)
    } else {
      // Get products with filters
      const params = {
        page,
        limit,
        sort,
        order,
      }

      if (category) params.category = category
      if (brand) params.brand = brand
      if (featured) params.featured = featured

      response = await ProductAPI.getAll(params)
      return NextResponse.json(response)
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}

// Create product (admin only)
export async function POST(request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get product data from request
    const productData = await request.json()

    // Call the backend API
    const response = await ProductAPI.create(productData)

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}
