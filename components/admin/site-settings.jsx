"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ColorPicker } from "@/components/admin/color-picker"

export function SiteSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    siteName: "E-Shop",
    siteDescription: "Your one-stop shop for all your needs",
    primaryColor: "#0f172a",
    heroDesign: "hero-1",
    featuredDesign: "featured-1",
    categoriesDesign: "categories-1",
    testimonialsDesign: "testimonials-1",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleColorChange = (color) => {
    setSettings((prev) => ({ ...prev, primaryColor: color }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // In a real app, this would be an API call to save the settings
    // await fetch('/api/admin/settings', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(settings),
    // })

    toast({
      title: "Settings saved",
      description: "Your site settings have been updated successfully.",
    })
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="sections">Section Designs</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" name="siteName" value={settings.siteName} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </TabsContent>
      <TabsContent value="appearance" className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-4">
              <ColorPicker color={settings.primaryColor} onChange={handleColorChange} />
              <Input
                id="primaryColor"
                name="primaryColor"
                value={settings.primaryColor}
                onChange={handleChange}
                className="w-32"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This color will be used for buttons, links, and accents throughout the site.
            </p>
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </TabsContent>
      <TabsContent value="sections" className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroDesign">Hero Section Design</Label>
            <Select value={settings.heroDesign} onValueChange={(value) => handleSelectChange("heroDesign", value)}>
              <SelectTrigger id="heroDesign">
                <SelectValue placeholder="Select a design" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero-1">Design 1 - Split with Image</SelectItem>
                <SelectItem value="hero-2">Design 2 - Full Width with Background</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="featuredDesign">Featured Products Design</Label>
            <Select
              value={settings.featuredDesign}
              onValueChange={(value) => handleSelectChange("featuredDesign", value)}
            >
              <SelectTrigger id="featuredDesign">
                <SelectValue placeholder="Select a design" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured-1">Design 1 - Grid with Details</SelectItem>
                <SelectItem value="featured-2">Design 2 - Minimal Cards</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoriesDesign">Categories Design</Label>
            <Select
              value={settings.categoriesDesign}
              onValueChange={(value) => handleSelectChange("categoriesDesign", value)}
            >
              <SelectTrigger id="categoriesDesign">
                <SelectValue placeholder="Select a design" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="categories-1">Design 1 - Grid with Images</SelectItem>
                <SelectItem value="categories-2">Design 2 - List with Icons</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="testimonialsDesign">Testimonials Design</Label>
            <Select
              value={settings.testimonialsDesign}
              onValueChange={(value) => handleSelectChange("testimonialsDesign", value)}
            >
              <SelectTrigger id="testimonialsDesign">
                <SelectValue placeholder="Select a design" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="testimonials-1">Design 1 - Cards</SelectItem>
                <SelectItem value="testimonials-2">Design 2 - Carousel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
