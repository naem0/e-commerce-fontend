import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            return null
          }

          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
          console.log("Calling backend API:", `${API_URL}/auth/login`)

          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          console.log("Backend response status:", response.status)

          if (!response.ok) {
            const errorText = await response.text()
            console.log("Backend error:", errorText)
            return null
          }

          const data = await response.json()
          console.log("Backend response data:", data)

          if (data.success && data.user && data.token) {
            const user = {
              id: data.user._id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              accessToken: data.token,
            }

            console.log("NextAuth user object:", user)
            return user
          }
          return null
        } catch (error) {
          console.error("NextAuth authorize error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT callback - storing user data:", {
          email: user.email,
          role: user.role,
          hasToken: !!user.accessToken,
        })
        token.accessToken = user.accessToken
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      console.log("Session callback - token data:", {
        email: token.email,
        role: token.role,
        hasAccessToken: !!token.accessToken,
      })

      session.accessToken = token.accessToken
      session.user.role = token.role
      session.user.id = token.id

      console.log("Final session:", {
        email: session.user.email,
        role: session.user.role,
        hasAccessToken: !!session.accessToken,
      })

      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key",
  debug: true,
})

export { handler as GET, handler as POST }
