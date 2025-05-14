import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { SettingsAPI } from "@/lib/api"

// Get site settings
export async function GET() {
  try {
    // Call the backend API
    const response = await SettingsAPI.get()
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}

// Update site settings (admin only)
export async function PUT(request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get settings data from request
    const settingsData = await request.json()

    // Call the backend API
    const response = await SettingsAPI.update(settingsData)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 })
  }
}
