"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useSiteSettings } from "@/components/site-settings-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function SiteSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { settings, updateSettings, loading: settingsLoading } = useSiteSettings()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    siteName: "",
    logo: "",
    favicon: "",
    primaryColor: "",
    secondaryColor: "",
    heroDesign: "",
    featuredDesign: "",
    categoriesDesign: "",
    testimonialsDesign: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      address: "",
    },
    metaTags: {
      title: "",
      description: "",
      keywords: "",
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/admin/site-settings")
    } else if (status === "authenticated" && session.user.role !== "admin") {
      router.push("/")
    }
  }, [status, router])

  // Load settings when available
  useEffect(() => {
    if (!settingsLoading && settings) {
      setFormData({
        siteName: settings.siteName || "",
        logo: settings.logo || "",
        favicon: settings.favicon || "",
        primaryColor: settings.primaryColor || "#3b82f6",
        secondaryColor: settings.secondaryColor || "#10b981",
        heroDesign: settings.heroDesign || "hero-1",
        featuredDesign: settings.featuredDesign || "featured-1",
        categoriesDesign: settings.categoriesDesign || "categories-1",
        testimonialsDesign: settings.testimonialsDesign || "testimonials-1",
        socialLinks: {
          facebook: settings.socialLinks?.facebook || "",
          twitter: settings.socialLinks?.twitter || "",
          instagram: settings.socialLinks?.instagram || "",
          youtube: settings.socialLinks?.youtube || "",
        },
        contactInfo: {
          email: settings.contactInfo?.email || "",
          phone: settings.contactInfo?.phone || "",
          address: settings.contactInfo?.address || "",
        },
        metaTags: {
          title: settings.metaTags?.title || "",
          description: settings.metaTags?.description || "",
          keywords: settings.metaTags?.keywords || "",
        },
      })
    }
  }, [settings, settingsLoading])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success = await updateSettings(formData)

      if (success) {
        toast({
          title: "Settings Updated",
          description: "Site settings have been updated successfully.",
        })
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update site settings.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading" || settingsLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === "authenticated" && session.user.role !== "admin") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="contact">Contact & Social</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic information about your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    placeholder="Your Store Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    name="favicon"
                    value={formData.favicon}
                    onChange={handleChange}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      name="primaryColor"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      name="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      name="secondaryColor"
                      placeholder="#10b981"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroDesign">Hero Design</Label>
                  <Select
                    value={formData.heroDesign}
                    onValueChange={(value) => handleSelectChange(value, "heroDesign")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hero design" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero-1">Design 1</SelectItem>
                      <SelectItem value="hero-2">Design 2</SelectItem>
                      <SelectItem value="hero-3">Design 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featuredDesign">Featured Products Design</Label>
                  <Select
                    value={formData.featuredDesign}
                    onValueChange={(value) => handleSelectChange(value, "featuredDesign")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select featured products design" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured-1">Design 1</SelectItem>
                      <SelectItem value="featured-2">Design 2</SelectItem>
                      <SelectItem value="featured-3">Design 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoriesDesign">Categories Design</Label>
                  <Select
                    value={formData.categoriesDesign}
                    onValueChange={(value) => handleSelectChange(value, "categoriesDesign")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select categories design" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="categories-1">Design 1</SelectItem>
                      <SelectItem value="categories-2">Design 2</SelectItem>
                      <SelectItem value="categories-3">Design 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonialsDesign">Testimonials Design</Label>
                  <Select
                    value={formData.testimonialsDesign}
                    onValueChange={(value) => handleSelectChange(value, "testimonialsDesign")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select testimonials design" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testimonials-1">Design 1</SelectItem>
                      <SelectItem value="testimonials-2">Design 2</SelectItem>
                      <SelectItem value="testimonials-3">Design 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact & Social Media</CardTitle>
                <CardDescription>Contact information and social media links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactInfo.email">Contact Email</Label>
                  <Input
                    id="contactInfo.email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactInfo.phone">Contact Phone</Label>
                  <Input
                    id="contactInfo.phone"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleChange}
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactInfo.address">Address</Label>
                  <Textarea
                    id="contactInfo.address"
                    name="contactInfo.address"
                    value={formData.contactInfo.address}
                    onChange={handleChange}
                    placeholder="123 Main St, City, Country"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialLinks.facebook">Facebook URL</Label>
                  <Input
                    id="socialLinks.facebook"
                    name="socialLinks.facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourstore"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialLinks.twitter">Twitter URL</Label>
                  <Input
                    id="socialLinks.twitter"
                    name="socialLinks.twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/yourstore"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialLinks.instagram">Instagram URL</Label>
                  <Input
                    id="socialLinks.instagram"
                    name="socialLinks.instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourstore"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialLinks.youtube">YouTube URL</Label>
                  <Input
                    id="socialLinks.youtube"
                    name="socialLinks.youtube"
                    value={formData.socialLinks.youtube}
                    onChange={handleChange}
                    placeholder="https://youtube.com/yourstore"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Search engine optimization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTags.title">Meta Title</Label>
                  <Input
                    id="metaTags.title"
                    name="metaTags.title"
                    value={formData.metaTags.title}
                    onChange={handleChange}
                    placeholder="Your Store - Best Products Online"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTags.description">Meta Description</Label>
                  <Textarea
                    id="metaTags.description"
                    name="metaTags.description"
                    value={formData.metaTags.description}
                    onChange={handleChange}
                    placeholder="Your store description for search engines"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTags.keywords">Meta Keywords</Label>
                  <Textarea
                    id="metaTags.keywords"
                    name="metaTags.keywords"
                    value={formData.metaTags.keywords}
                    onChange={handleChange}
                    placeholder="e-commerce, online store, products"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
