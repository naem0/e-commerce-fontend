import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// In a real app, this would be a database
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$10$XQxLUUJZp8yd3z/Zo7UTAOTQyNO.p1IfCGEjfRrZQAyxWMxXs4gGi", // admin123
    role: "admin",
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: "$2a$10$XQxLUUJZp8yd3z/Zo7UTAOTQyNO.p1IfCGEjfRrZQAyxWMxXs4gGi", // user123
    role: "user",
  },
]

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role for new registrations
    }

    // In a real app, you would save to a database
    users.push(newUser)

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
