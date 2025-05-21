"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { getSiteSettings, updateSiteSettings } from "@/services/settings.service"

const SiteSettingsContext = createContext({
  settings: {},
  loading: true,
  error: null,
  updateSettings: async () => {},
})

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  // Fetch site settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const data = await getSiteSettings()

        if (data.success) {
          setSettings(data.settings)

          // Apply CSS variables for theme colors
          if (data.settings.primaryColor) {
            document.documentElement.style.setProperty("--primary-color", data.settings.primaryColor)
          }

          if (data.settings.secondaryColor) {
            document.documentElement.style.setProperty("--secondary-color", data.settings.secondaryColor)
          }
        } else {
          throw new Error(data.message || "Failed to fetch site settings")
        }
      } catch (err) {
        console.error("Error fetching site settings:", err)
        setError(err.message)
        toast({
          title: "Error",
          description: "Failed to load site settings. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  // Function to update site settings
  const updateSettings = async (newSettings) => {
    try {
      setLoading(true)
      const data = await updateSiteSettings(newSettings)

      if (data.success) {
        setSettings(data.settings)

        // Apply CSS variables for theme colors
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
      } else {
        throw new Error(data.message || "Failed to update site settings")
      }
    } catch (err) {
      console.error("Error updating site settings:", err)
      setError(err.message)
      toast({
        title: "Error",
        description: err.message || "Failed to update site settings",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider")
  }
  return context
}
