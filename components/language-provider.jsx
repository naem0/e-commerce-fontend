"use client"

import { createContext, useContext, useState, useEffect } from "react"
import translations from "../translations" // Verify this path is correct

const LanguageContext = createContext(undefined)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language")
      if (savedLanguage && translations[savedLanguage]) {
        setLanguageState(savedLanguage)
      }
      setIsLoaded(true)
    }
  }, [])

  const setLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguageState(newLanguage)
      if (typeof window !== "undefined") {
        localStorage.setItem("language", newLanguage)
      }
    }
  }

  const t = (key) => {
    if (!isLoaded) return key // Return key while loading
    const translation = translations[language]?.[key]
    if (!translation) {
      console.warn(`Translation missing for key "${key}" in language "${language}"`)
      return key
    }
    return translation
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function useTranslation() {
  return useLanguage()
}