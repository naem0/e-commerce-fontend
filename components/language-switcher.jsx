"use client"

import { useLanguage } from "./language-provider"

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-2 py-1 rounded ${language === "en" ? "bg-primary text-white" : "bg-gray-200"}`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("bn")}
        className={`px-2 py-1 rounded ${language === "bn" ? "bg-primary text-white" : "bg-gray-200"}`}
      >
        বাংলা
      </button>
    </div>
  )
}
