import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { OrderAPI } from "@/lib/api"

// Get orders
export async function GET(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get search params from URL
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // Call the backend API
    let response

    if (id) {
      // Get a single order
      response = await OrderAPI.getById(id)
      return NextResponse.json(response)
    } else {
      // Get all orders
      response = await OrderAPI.getAll()
      return NextResponse.json(response)
    }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}

// Create order
export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get order data from request
    const orderData = await request.json()

    // Call the backend API
    const response = await OrderAPI.create(orderData)

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}
