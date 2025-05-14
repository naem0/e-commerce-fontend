"use client"

import { createContext, useContext, useState, useEffect } from "react"
import translations from "../translations"

// Create the language context
const LanguageContext = createContext()

// Create the language provider component
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en")

  // Function to change the language
  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang)
      localStorage.setItem("language", lang)
    }
  }

  // Function to get a translation
  const t = (key) => {
    if (!translations[language]) return key
    return translations[language][key] || key
  }

  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  return <LanguageContext.Provider value={{ language, changeLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Export useTranslation as an alias for useLanguage to maintain compatibility
export function useTranslation() {
  return useLanguage()
}
