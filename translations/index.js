import { en } from "./en.js"
import { bn } from "./bn.js"

const translations = {
  en,
  bn,
}

export default translations

export const getTranslation = (language, key) => {
  const keys = key.split(".")
  let value = translations[language] || translations.en

  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }

  // Fallback to English if translation not found
  if (value === undefined && language !== "en") {
    value = translations.en
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }
  }

  return value || key
}

export const availableLanguages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
]
