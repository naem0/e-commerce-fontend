"use client"

import { createContext, useContext, useState } from "react"
import { useToast } from "@/hooks/use-toast"

const SiteSettingsContext = createContext({
  settings: {},
  updateSettings: async () => {},
})

export function SiteSettingsProvider({ initialSettings, children }) {
  const [settings, setSettings] = useState(initialSettings || {})
  const { toast } = useToast()

  const updateSettings = async (newSettings) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      setSettings(data.settings)

      // Apply theme colors
      if (data.settings.primaryColor) {
        document.documentElement.style.setProperty("--primary-color", data.settings.primaryColor)
      }
      if (data.settings.secondaryColor) {
        document.documentElement.style.setProperty("--secondary-color", data.settings.secondaryColor)
      }

      toast({
        title: "Success",
        description: "Site settings updated successfully",
      })

      return true
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to update site settings",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider")
  }
  return context
}
