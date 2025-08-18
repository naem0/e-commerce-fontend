import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await response.json()

          if (response.ok && data.success && data.user) {
            return {
              id: data.user._id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              accessToken: data.token,
            }
          }
          return null
        } catch (error) {
          console.error("Auth error:", error.message)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)