"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("theme")

    if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
      setTheme(storedTheme)
    } else {
      // Check system preference if no stored theme
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme)
      localStorage.setItem("theme", systemTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Apply theme to document
    const root = document.documentElement

    if (theme === "dark") {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.add("light")
      root.classList.remove("dark")
    }

    // Save theme to localStorage
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="opacity-0">{children}</div>
  }

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
