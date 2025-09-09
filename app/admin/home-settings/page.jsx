"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Trash2,
  Plus,
  GripVertical,
  Settings,
  Star,
  Flame,
  Clock,
  TrendingUp,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { getSiteSettings, updateSiteSettings } from "@/services/settings.service"
import { getCategories } from "@/services/category.service"
import { getProducts } from "@/services/product.service"
import { useToast } from "@/hooks/use-toast"

const SECTION_TYPES = [
  { value: "best-sellers", label: "Best Sellers", icon: Star },
  { value: "flash-sale", label: "Flash Sale", icon: Flame },
  { value: "category-best-sellers", label: "Category Best Sellers", icon: Star },
  { value: "new-arrivals", label: "New Arrivals", icon: Clock },
  { value: "trending", label: "Trending Products", icon: TrendingUp },
  { value: "custom-products", label: "Custom Products", icon: Settings },
]

const DESIGN_OPTIONS = {
  banner: [
    { value: "banner-1", label: "Simple Slider" },
    { value: "banner-2", label: "Full Width Overlay" },
    { value: "banner-3", label: "Split Layout" },
    { value: "banner-4", label: "Side Category + Banner" },
  ],
  featuredProducts: [
    { value: "featured-1", label: "Grid Layout" },
    { value: "featured-2", label: "Carousel" },
    { value: "featured-3", label: "Card Style" },
  ],
  categories: [
    { value: "categories-1", label: "Grid Cards" },
    { value: "categories-2", label: "Icon Style" },
    { value: "categories-3", label: "Image Overlay" },
  ],
  testimonials: [
    { value: "testimonials-1", label: "Card Layout" },
    { value: "testimonials-2", label: "Slider" },
    { value: "testimonials-3", label: "Minimal" },
  ],
  newsletter: [
    { value: "newsletter-1", label: "Simple Form" },
    { value: "newsletter-2", label: "Background Image" },
    { value: "newsletter-3", label: "Split Layout" },
  ],
  custom: [
    { value: "custom-1", label: "Grid Layout" },
    { value: "custom-2", label: "List Layout" },
    { value: "custom-3", label: "Card Style" },
  ],
}

export default function HomeSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [settings, setSettings] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/admin/home-settings")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [settingsResult, categoriesResult, productsResult] = await Promise.all([
          getSiteSettings(),
          getCategories(),
          getProducts({ limit: 100 }),
        ])

        if (categoriesResult.success) {
          setCategories(categoriesResult.categories)
        }

        if (productsResult.success) {
          setProducts(productsResult.products)
        }

        if (settingsResult.success) {
          setSettings(settingsResult.settings)
        } else {
          // Create default settings
          setSettings({
            homePageSections: {
              banner: { enabled: true, design: "banner-1", order: 1 },
              featuredProducts: { enabled: true, design: "featured-1", order: 2, title: "Featured Products", limit: 8 },
              categories: { enabled: true, design: "categories-1", order: 3, title: "Shop by Category", limit: 8 },
              customSections: [],
              categoryProducts: [],
              testimonials: {
                enabled: true,
                design: "testimonials-1",
                order: 4,
                title: "What Our Customers Say",
                limit: 6,
              },
              newsletter: { enabled: true, design: "newsletter-1", order: 5, title: "Subscribe to Our Newsletter" },
            },
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load settings. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchData()
    }
  }, [status, router, toast])

  const handleSectionToggle = (sectionKey, enabled) => {
    setSettings((prev) => ({
      ...prev,
      homePageSections: {
        ...prev.homePageSections,
        [sectionKey]: {
          ...prev.homePageSections[sectionKey],
          enabled,
        },
      },
    }))
  }

  const handleSectionUpdate = (sectionKey, updates) => {
    setSettings((prev) => ({
      ...prev,
      homePageSections: {
        ...prev.homePageSections,
        [sectionKey]: {
          ...prev.homePageSections[sectionKey],
          ...updates,
        },
      },
    }))
  }

  const addCustomSection = () => {
    const newSection = {
      id: `custom-${Date.now()}`,
      title: "New Section",
      type: "best-sellers",
      enabled: true,
      design: "custom-1",
      order: (settings.homePageSections?.customSections?.length || 0) + 10,
      settings: {
        limit: 8,
        showTimer: false,
        backgroundColor: "",
        textColor: "",
      },
    }

    setSettings((prev) => ({
      ...prev,
      homePageSections: {
        ...prev.homePageSections,
        customSections: [...(prev.homePageSections.customSections || []), newSection],
      },
    }))
  }

  const removeCustomSection = (index) => {
    setSettings((prev) => ({
      ...prev,
      homePageSections: {
        ...prev.homePageSections,
        customSections: prev.homePageSections.customSections.filter((_, i) => i !== index),
      },
    }))
  }

  const updateCustomSection = (index, updates) => {
    setSettings((prev) => ({
      ...prev,
      homePageSections: {
        ...prev.homePageSections,
        customSections: prev.homePageSections.customSections.map((section, i) =>
          i === index ? { ...section, ...updates } : section,
        ),
      },
    }))
  }

  const moveCustomSection = (index, direction) => {
    setSettings((prev) => {
      const sections = [...prev.homePageSections.customSections]
      const newIndex = direction === "up" ? index - 1 : index + 1

      if (newIndex < 0 || newIndex >= sections.length)
        return prev

        // Swap sections
      ;[sections[index], sections[newIndex]] = [sections[newIndex], sections[index]]

      // Update order values
      sections.forEach((section, i) => {
        section.order = i + 10
      })

      return {
        ...prev,
        homePageSections: {
          ...prev.homePageSections,
          customSections: sections,
        },
      }
    })
  }

  const addCategorySection = () => {
    const newSection = {
      id: `category-${Date.now()}`,
      categoryId: "", // This should be empty initially
      title: "Category Products",
      enabled: true,
      design: "category-1",
      order: (settings.homePageSections?.categoryProducts?.length || 0) + 20,
      settings: {
        limit: 8,
        showViewAll: true,
        backgroundColor: "#ffffff",
        textColor: "",
      },
    }

    setSettings((prev) => ({
      ...prev,
      homePageSections: {
        ...prev.homePageSections,
        categoryProducts: [...(prev.homePageSections.categoryProducts || []), newSection],
      },
    }))
  }

  const removeCategorySection = (index) => {
    setSettings((prev) => ({
      ...prev,
      homePageSections: {
        ...prev.homePageSections,
        categoryProducts: prev.homePageSections.categoryProducts.filter((_, i) => i !== index),
      },
    }))
  }

  const updateCategorySection = (index, updates) => {
    setSettings((prev) => ({
      ...prev,
      homePageSections: {
        ...prev.homePageSections,
        categoryProducts: prev.homePageSections.categoryProducts.map((section, i) =>
          i === index ? { ...section, ...updates } : section,
        ),
      },
    }))
  }

  const moveCategorySection = (index, direction) => {
    setSettings((prev) => {
      const sections = [...prev.homePageSections.categoryProducts]
      const newIndex = direction === "up" ? index - 1 : index + 1

      if (newIndex < 0 || newIndex >= sections.length)
        return prev

        // Swap sections
      ;[sections[index], sections[newIndex]] = [sections[newIndex], sections[index]]

      // Update order values
      sections.forEach((section, i) => {
        section.order = i + 20
      })

      return {
        ...prev,
        homePageSections: {
          ...prev.homePageSections,
          categoryProducts: sections,
        },
      }
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      const result = await updateSiteSettings(settings)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Home page settings updated successfully",
        })
      } else {
        throw new Error(result.message || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === "authenticated" && session?.user?.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Home Page Settings
          </h1>
          <p className="text-muted-foreground">Configure your home page sections and layout</p>
          {session?.user && (
            <p className="text-sm text-gray-500">
              Logged in as: {session.user.email} ({session.user.role})
            </p>
          )}
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg" className="bg-primary-custom hover:bg-primary-custom/90">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="sections" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">Main Sections</TabsTrigger>
          <TabsTrigger value="custom-sections">Custom Sections</TabsTrigger>
          <TabsTrigger value="category-sections">Category Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-6">
          {/* Banner Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4" />
                  Banner Section
                </CardTitle>
                <Switch
                  checked={settings?.homePageSections?.banner?.enabled || false}
                  onCheckedChange={(enabled) => handleSectionToggle("banner", enabled)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Design Style</Label>
                  <Select
                    value={settings?.homePageSections?.banner?.design || "banner-1"}
                    onValueChange={(value) => handleSectionUpdate("banner", { design: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGN_OPTIONS.banner.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={settings?.homePageSections?.banner?.order || 1}
                    onChange={(e) => handleSectionUpdate("banner", { order: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Products Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4" />
                  Featured Products Section
                </CardTitle>
                <Switch
                  checked={settings?.homePageSections?.featuredProducts?.enabled || false}
                  onCheckedChange={(enabled) => handleSectionToggle("featuredProducts", enabled)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Section Title</Label>
                  <Input
                    value={settings?.homePageSections?.featuredProducts?.title || ""}
                    onChange={(e) => handleSectionUpdate("featuredProducts", { title: e.target.value })}
                    placeholder="Featured Products"
                  />
                </div>
                <div>
                  <Label>Design Style</Label>
                  <Select
                    value={settings?.homePageSections?.featuredProducts?.design || "featured-1"}
                    onValueChange={(value) => handleSectionUpdate("featuredProducts", { design: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGN_OPTIONS.featuredProducts.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={settings?.homePageSections?.featuredProducts?.order || 2}
                    onChange={(e) =>
                      handleSectionUpdate("featuredProducts", { order: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Products Limit</Label>
                <Input
                  type="number"
                  value={settings?.homePageSections?.featuredProducts?.limit || 8}
                  onChange={(e) => handleSectionUpdate("featuredProducts", { limit: Number.parseInt(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4" />
                  Categories Section
                </CardTitle>
                <Switch
                  checked={settings?.homePageSections?.categories?.enabled || false}
                  onCheckedChange={(enabled) => handleSectionToggle("categories", enabled)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Section Title</Label>
                  <Input
                    value={settings?.homePageSections?.categories?.title || ""}
                    onChange={(e) => handleSectionUpdate("categories", { title: e.target.value })}
                    placeholder="Shop by Category"
                  />
                </div>
                <div>
                  <Label>Design Style</Label>
                  <Select
                    value={settings?.homePageSections?.categories?.design || "categories-1"}
                    onValueChange={(value) => handleSectionUpdate("categories", { design: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGN_OPTIONS.categories.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={settings?.homePageSections?.categories?.order || 3}
                    onChange={(e) => handleSectionUpdate("categories", { order: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Categories Limit</Label>
                <Input
                  type="number"
                  value={settings?.homePageSections?.categories?.limit || 8}
                  onChange={(e) => handleSectionUpdate("categories", { limit: Number.parseInt(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Testimonials Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4" />
                  Testimonials Section
                </CardTitle>
                <Switch
                  checked={settings?.homePageSections?.testimonials?.enabled || false}
                  onCheckedChange={(enabled) => handleSectionToggle("testimonials", enabled)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Section Title</Label>
                  <Input
                    value={settings?.homePageSections?.testimonials?.title || ""}
                    onChange={(e) => handleSectionUpdate("testimonials", { title: e.target.value })}
                    placeholder="What Our Customers Say"
                  />
                </div>
                <div>
                  <Label>Design Style</Label>
                  <Select
                    value={settings?.homePageSections?.testimonials?.design || "testimonials-1"}
                    onValueChange={(value) => handleSectionUpdate("testimonials", { design: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGN_OPTIONS.testimonials.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={settings?.homePageSections?.testimonials?.order || 4}
                    onChange={(e) => handleSectionUpdate("testimonials", { order: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Testimonials Limit</Label>
                <Input
                  type="number"
                  value={settings?.homePageSections?.testimonials?.limit || 6}
                  onChange={(e) => handleSectionUpdate("testimonials", { limit: Number.parseInt(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4" />
                  Newsletter Section
                </CardTitle>
                <Switch
                  checked={settings?.homePageSections?.newsletter?.enabled || false}
                  onCheckedChange={(enabled) => handleSectionToggle("newsletter", enabled)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Section Title</Label>
                  <Input
                    value={settings?.homePageSections?.newsletter?.title || ""}
                    onChange={(e) => handleSectionUpdate("newsletter", { title: e.target.value })}
                    placeholder="Subscribe to Our Newsletter"
                  />
                </div>
                <div>
                  <Label>Design Style</Label>
                  <Select
                    value={settings?.homePageSections?.newsletter?.design || "newsletter-1"}
                    onValueChange={(value) => handleSectionUpdate("newsletter", { design: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGN_OPTIONS.newsletter.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={settings?.homePageSections?.newsletter?.order || 5}
                    onChange={(e) => handleSectionUpdate("newsletter", { order: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom-sections" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Custom Sections</h2>
              <p className="text-muted-foreground">Create custom sections like Best Sellers, Flash Sale, etc.</p>
            </div>
            <Button onClick={addCustomSection} className="bg-primary-custom hover:bg-primary-custom/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Section
            </Button>
          </div>

          {settings?.homePageSections?.customSections?.map((section, index) => {
            const SectionIcon = SECTION_TYPES.find((type) => type.value === section.type)?.icon || Settings

            return (
              <Card key={section.id || index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4" />
                      <SectionIcon className="w-4 h-4" />
                      {section.title}
                      <Badge variant="outline">
                        {SECTION_TYPES.find((type) => type.value === section.type)?.label || section.type}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveCustomSection(index, "up")}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveCustomSection(index, "down")}
                        disabled={index === (settings?.homePageSections?.customSections?.length || 0) - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Switch
                        checked={section.enabled}
                        onCheckedChange={(enabled) => updateCustomSection(index, { enabled })}
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeCustomSection(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Section Title</Label>
                      <Input
                        value={section.title || ""}
                        onChange={(e) => updateCustomSection(index, { title: e.target.value })}
                        placeholder="Section Title"
                      />
                    </div>
                    <div>
                      <Label>Section Type</Label>
                      <Select
                        value={section.type || "best-sellers"}
                        onValueChange={(value) => updateCustomSection(index, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SECTION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <type.icon className="w-4 h-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Design Style</Label>
                      <Select
                        value={section.design || "custom-1"}
                        onValueChange={(value) => updateCustomSection(index, { design: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DESIGN_OPTIONS.custom.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Products Limit</Label>
                      <Input
                        type="number"
                        value={section.settings?.limit || 8}
                        onChange={(e) =>
                          updateCustomSection(index, {
                            settings: { ...section.settings, limit: Number.parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input
                        type="number"
                        value={section.order || 10}
                        onChange={(e) => updateCustomSection(index, { order: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>Background Color (Optional)</Label>
                      <Input
                        type="color"
                        value={section.settings?.backgroundColor || "#ffffff"}
                        onChange={(e) =>
                          updateCustomSection(index, {
                            settings: { ...section.settings, backgroundColor: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Category selection for category-best-sellers */}
                  {section.type === "category-best-sellers" && (
                    <div>
                      <Label>Select Category</Label>
                      <Select
                        value={section.settings?.categoryId || ""}
                        onValueChange={(value) =>
                          updateCustomSection(index, {
                            settings: { ...section.settings, categoryId: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Flash sale settings */}
                  {section.type === "flash-sale" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Show Timer</Label>
                        <Switch
                          checked={section.settings?.showTimer || false}
                          onCheckedChange={(checked) =>
                            updateCustomSection(index, {
                              settings: { ...section.settings, showTimer: checked },
                            })
                          }
                        />
                      </div>
                      {section.settings?.showTimer && (
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="datetime-local"
                            value={
                              section.settings?.endDate
                                ? new Date(section.settings.endDate).toISOString().slice(0, 16)
                                : ""
                            }
                            onChange={(e) =>
                              updateCustomSection(index, {
                                settings: { ...section.settings, endDate: e.target.value },
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Custom products selection */}
                  {section.type === "custom-products" && (
                    <div>
                      <Label>Select Products</Label>
                      <Select
                        value=""
                        onValueChange={(value) => {
                          const currentIds = section.settings?.productIds || []
                          if (!currentIds.includes(value)) {
                            updateCustomSection(index, {
                              settings: { ...section.settings, productIds: [...currentIds, value] },
                            })
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add Product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product._id} value={product._id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Selected products */}
                      {section.settings?.productIds && section.settings.productIds.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {section.settings.productIds.map((productId) => {
                            const product = products.find((p) => p._id === productId)
                            return (
                              <Badge key={productId} variant="secondary" className="flex items-center gap-1">
                                {product?.name || "Unknown Product"}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                  onClick={() => {
                                    const newIds = section.settings.productIds.filter((id) => id !== productId)
                                    updateCustomSection(index, {
                                      settings: { ...section.settings, productIds: newIds },
                                    })
                                  }}
                                >
                                  ×
                                </Button>
                              </Badge>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {(!settings?.homePageSections?.customSections || settings.homePageSections.customSections.length === 0) && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No custom sections yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create custom sections like Best Sellers, Flash Sale, New Arrivals, etc.
                </p>
                <Button onClick={addCustomSection} className="bg-primary-custom hover:bg-primary-custom/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Custom Section
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="category-sections" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Category Sections</h2>
              <p className="text-muted-foreground">Display products from specific categories on your home page.</p>
            </div>
            <Button onClick={addCategorySection} className="bg-primary-custom hover:bg-primary-custom/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Category Section
            </Button>
          </div>

          {settings?.homePageSections?.categoryProducts?.map((section, index) => (
            <Card key={section.id || index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4" />
                    {section.title}
                    <Badge variant="outline">Category Section</Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveCategorySection(index, "up")}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveCategorySection(index, "down")}
                      disabled={index === (settings?.homePageSections?.categoryProducts?.length || 0) - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Switch
                      checked={section.enabled}
                      onCheckedChange={(enabled) => updateCategorySection(index, { enabled })}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeCategorySection(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Section Title</Label>
                    <Input
                      value={section.title || ""}
                      onChange={(e) => updateCategorySection(index, { title: e.target.value })}
                      placeholder="Category Products"
                    />
                  </div>
                  <div>
                    <Label>Select Category</Label>
                    <Select
                      value={section.categoryId || ""}
                      onValueChange={(value) => {
                        const category = categories.find((c) => c._id === value)
                        updateCategorySection(index, {
                          categoryId: value,
                          title: category ? `${category.name} Products` : section.title,
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Design Style</Label>
                    <Select
                      value={section.design || "category-1"}
                      onValueChange={(value) => updateCategorySection(index, { design: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category-1">Grid Layout</SelectItem>
                        <SelectItem value="category-2">List Layout</SelectItem>
                        <SelectItem value="category-3">Card Style</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Products Limit</Label>
                    <Input
                      type="number"
                      value={section.settings?.limit || 8}
                      onChange={(e) =>
                        updateCategorySection(index, {
                          settings: { ...section.settings, limit: Number.parseInt(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      value={section.order || 20}
                      onChange={(e) => updateCategorySection(index, { order: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Background Color (Optional)</Label>
                    <Input
                      type="color"
                      value={section.settings?.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        updateCategorySection(index, {
                          settings: { ...section.settings, backgroundColor: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Show "View All" Button</Label>
                  <Switch
                    checked={section.settings?.showViewAll || false}
                    onCheckedChange={(checked) =>
                      updateCategorySection(index, {
                        settings: { ...section.settings, showViewAll: checked },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {(!settings?.homePageSections?.categoryProducts ||
            settings.homePageSections.categoryProducts.length === 0) && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No category sections yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add sections to display products from specific categories on your home page.
                </p>
                <Button onClick={addCategorySection} className="bg-primary-custom hover:bg-primary-custom/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Category Section
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
