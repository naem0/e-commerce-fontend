import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { BrandAPI } from "@/lib/api"

// Get brands
export async function GET(request) {
  try {
    // Get search params from URL
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // Call the backend API
    let response

    if (id) {
      // Get a single brand
      response = await BrandAPI.getById(id)
      return NextResponse.json(response)
    } else {
      // Get all brands
      response = await BrandAPI.getAll()
      return NextResponse.json(response)
    }
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}

// Create brand (admin only)
export async function POST(request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get brand data from request
    const brandData = await request.json()

    // Call the backend API
    const response = await BrandAPI.create(brandData)

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating brand:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}
