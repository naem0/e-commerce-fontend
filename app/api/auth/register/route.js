import { NextResponse } from "next/server"
import { AuthAPI } from "@/lib/api"

export async function POST(request) {
  try {
    // Get registration data from request
    const userData = await request.json()

    // Validate input
    if (!userData.name || !userData.email || !userData.password) {
      return NextResponse.json({ success: false, message: "Please provide all required fields" }, { status: 400 })
    }

    // Call the backend API
    const response = await AuthAPI.register(userData)

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)

    // Handle expected errors from the API
    if (error.message === "User with this email already exists") {
      return NextResponse.json({ success: false, message: "User with this email already exists" }, { status: 400 })
    }

    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}
