"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({ theme: "light", setTheme: () => null })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null

    // Check system preference if no stored theme
    if (!storedTheme && typeof window !== "undefined") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme)
      localStorage.setItem("theme", systemTheme)
    } else if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      // Save theme to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", theme)
      }
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
