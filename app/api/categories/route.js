import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { CategoryAPI } from "@/lib/api"

// Get categories
export async function GET(request) {
  try {
    // Get search params from URL
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // Call the backend API
    let response

    if (id) {
      // Get a single category
      response = await CategoryAPI.getById(id)
      return NextResponse.json(response)
    } else {
      // Get all categories
      response = await CategoryAPI.getAll()
      return NextResponse.json(response)
    }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}

// Create category (admin only)
export async function POST(request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get category data from request
    const categoryData = await request.json()

    // Call the backend API
    const response = await CategoryAPI.create(categoryData)

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}
