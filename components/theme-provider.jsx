"use client"

import { createContext, useContext, useEffect } from "react"

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
})

export function ThemeProvider({ children }) {
  useEffect(() => {
    // Force light theme
    const root = document.documentElement
    root.classList.add("light")
    root.classList.remove("dark")
    localStorage.setItem("theme", "light")
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: "light", setTheme: () => {}, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
