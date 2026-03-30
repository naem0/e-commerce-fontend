import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
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
    async jwt({ token, user, account }) {
      if (account && account.provider === "google" && user) {
        try {
          const response = await fetch(`${API_URL}/api/auth/google-login`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: user.name,
               email: user.email,
               image: user.image,
               provider: "google",
            }),
          })
          const data = await response.json()
          if (data.success && data.user && data.token) {
            token.accessToken = data.token
            token.role = data.user.role
            token.id = data.user._id || data.user.id
          } else {
             console.error("Backend google login failed:", data.message)
          }
        } catch (error) {
           console.error("Google login sync error:", error)
        }
      } else if (user) {
        token.accessToken = user.accessToken
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id || token.sub
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret",
  debug: process.env.NODE_ENV === "development",
}

export default NextAuth(authOptions)