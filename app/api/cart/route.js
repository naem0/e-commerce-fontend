import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { CartAPI } from "@/lib/api"

// Get user's cart
export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Call the backend API
    const response = await CartAPI.get()

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}

// Update user's cart
export async function PUT(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get cart data from request
    const cartData = await request.json()

    // Call the backend API
    const response = await CartAPI.update(cartData)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}
