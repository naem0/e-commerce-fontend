import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

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
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          })

          if (response.data.success) {
            const user = response.data.user
            const token = response.data.token

            console.log("NextAuth authorize - User:", user.email, "Role:", user.role)
            console.log("NextAuth authorize - Token:", token ? "Present" : "Missing")

            return {
              id: user._id,
              email: user.email,
              name: user.name,
              role: user.role,
              accessToken: token,
            }
          }
          return null
        } catch (error) {
          console.error("NextAuth authorize error:", error.response?.data || error.message)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        console.log("NextAuth JWT callback - User login:", user.email)
        token.accessToken = user.accessToken
        token.role = user.role
        token.id = user.id
      }

      console.log("NextAuth JWT callback - Token:", {
        email: token.email,
        role: token.role,
        hasAccessToken: !!token.accessToken,
      })

      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken
      session.user.role = token.role
      session.user.id = token.id

      console.log("NextAuth session callback - Session:", {
        email: session.user.email,
        role: session.user.role,
        hasAccessToken: !!session.accessToken,
      })

      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
