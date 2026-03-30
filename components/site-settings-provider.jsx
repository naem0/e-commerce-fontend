"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { getSiteSettings, updateSiteSettingsWithFiles, updateSiteSettings } from "@/services/settings.service"

const SiteSettingsContext = createContext({
  settings: {},
  loading: true,
  updateSettings: async () => {},
})

export function SiteSettingsProvider({ initialSettings, children }) {
  const [settings, setSettings] = useState(initialSettings || {})
  const [loading, setLoading] = useState(!initialSettings)
  const { toast } = useToast()

  useEffect(() => {
    if (!initialSettings) {
      const fetchSettings = async () => {
        const result = await getSiteSettings()
        if (result.success) {
          setSettings(result.settings)
        }
        setLoading(false)
      }
      fetchSettings()
    }
  }, [initialSettings])

  const updateSettings = async (formDataOrSettings, isFormData = false) => {
    try {
      const result = isFormData 
        ? await updateSiteSettingsWithFiles(formDataOrSettings)
        : await updateSiteSettings(formDataOrSettings)
        
      if (!result.success) throw new Error(result.message)

      setSettings(result.settings)

      // Apply theme colors
      if (result.settings?.primaryColor) {
        document.documentElement.style.setProperty("--primary-color", result.settings.primaryColor)
      }
      if (result.settings?.secondaryColor) {
        document.documentElement.style.setProperty("--secondary-color", result.settings.secondaryColor)
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
    <SiteSettingsContext.Provider value={{ settings, updateSettings, loading }}>
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
