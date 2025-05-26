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
import { Trash2, Plus, GripVertical } from "lucide-react"
import { getSiteSettings, updateSiteSettings } from "@/services/settings.service"
import { getCategories } from "@/services/category.service"
import { useToast } from "@/components/ui/use-toast"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function HomeSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [settings, setSettings] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/admin/home-settings")
    } else if (status === "authenticated" && session.user.role !== "admin") {
      router.push("/")
    }
  }, [status, session, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [settingsResult, categoriesResult] = await Promise.all([getSiteSettings(), getCategories()])

        if (settingsResult.success) {
          setSettings(settingsResult.settings)
        }

        if (categoriesResult.success) {
          setCategories(categoriesResult.categories)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session.user.role === "admin") {
      fetchData()
    }
  }, [status, session, toast])

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

  const addCategorySection = () => {
    const newSection = {
      enabled: true,
      design: "category-products-1",
      order: (settings.homePageSections.categoryProducts?.length || 0) + 4,
      categoryId: "",
      title: "",
      limit: 8,
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

  const handleSave = async () => {
    try {
      setSaving(true)
      const result = await updateSiteSettings(settings)

      if (result.success) {
        toast({
          title: "Success",
          description: "Home page settings updated successfully",
        })
      } else {
        throw new Error(result.message || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
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
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    )
  }

  if (status === "authenticated" && session.user.role !== "admin") {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Home Page Settings</h1>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="sections" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sections">Page Sections</TabsTrigger>
            <TabsTrigger value="category-sections">Category Sections</TabsTrigger>
          </TabsList>

          <TabsContent value="sections" className="space-y-6">
            {/* Banner Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Banner Section</CardTitle>
                  <Switch
                    checked={settings?.homePageSections?.banner?.enabled || false}
                    onCheckedChange={(enabled) => handleSectionToggle("banner", enabled)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Design</Label>
                    <Select
                      value={settings?.homePageSections?.banner?.design || "banner-1"}
                      onValueChange={(value) => handleSectionUpdate("banner", { design: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner-1">Simple Slider</SelectItem>
                        <SelectItem value="banner-2">Full Width Overlay</SelectItem>
                        <SelectItem value="banner-3">Split Layout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Order</Label>
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
                  <CardTitle>Featured Products Section</CardTitle>
                  <Switch
                    checked={settings?.homePageSections?.featuredProducts?.enabled || false}
                    onCheckedChange={(enabled) => handleSectionToggle("featuredProducts", enabled)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={settings?.homePageSections?.featuredProducts?.title || ""}
                      onChange={(e) => handleSectionUpdate("featuredProducts", { title: e.target.value })}
                      placeholder="Featured Products"
                    />
                  </div>
                  <div>
                    <Label>Limit</Label>
                    <Input
                      type="number"
                      value={settings?.homePageSections?.featuredProducts?.limit || 8}
                      onChange={(e) =>
                        handleSectionUpdate("featuredProducts", { limit: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Design</Label>
                    <Select
                      value={settings?.homePageSections?.featuredProducts?.design || "featured-1"}
                      onValueChange={(value) => handleSectionUpdate("featuredProducts", { design: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured-1">Grid Layout</SelectItem>
                        <SelectItem value="featured-2">Carousel Layout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category Filter</Label>
                    <Select
                      value={settings?.homePageSections?.featuredProducts?.categoryId || ""}
                      onValueChange={(value) => handleSectionUpdate("featuredProducts", { categoryId: value || null })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Categories Section</CardTitle>
                  <Switch
                    checked={settings?.homePageSections?.categories?.enabled || false}
                    onCheckedChange={(enabled) => handleSectionToggle("categories", enabled)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={settings?.homePageSections?.categories?.title || ""}
                      onChange={(e) => handleSectionUpdate("categories", { title: e.target.value })}
                      placeholder="Shop by Category"
                    />
                  </div>
                  <div>
                    <Label>Limit</Label>
                    <Input
                      type="number"
                      value={settings?.homePageSections?.categories?.limit || 8}
                      onChange={(e) => handleSectionUpdate("categories", { limit: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Design</Label>
                  <Select
                    value={settings?.homePageSections?.categories?.design || "categories-1"}
                    onValueChange={(value) => handleSectionUpdate("categories", { design: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="categories-1">Grid with Images</SelectItem>
                      <SelectItem value="categories-2">Icon Grid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Testimonials Section</CardTitle>
                  <Switch
                    checked={settings?.homePageSections?.testimonials?.enabled || false}
                    onCheckedChange={(enabled) => handleSectionToggle("testimonials", enabled)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={settings?.homePageSections?.testimonials?.title || ""}
                      onChange={(e) => handleSectionUpdate("testimonials", { title: e.target.value })}
                      placeholder="What Our Customers Say"
                    />
                  </div>
                  <div>
                    <Label>Limit</Label>
                    <Input
                      type="number"
                      value={settings?.homePageSections?.testimonials?.limit || 6}
                      onChange={(e) => handleSectionUpdate("testimonials", { limit: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Newsletter Section</CardTitle>
                  <Switch
                    checked={settings?.homePageSections?.newsletter?.enabled || false}
                    onCheckedChange={(enabled) => handleSectionToggle("newsletter", enabled)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={settings?.homePageSections?.newsletter?.title || ""}
                    onChange={(e) => handleSectionUpdate("newsletter", { title: e.target.value })}
                    placeholder="Subscribe to Our Newsletter"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="category-sections" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Category Product Sections</h2>
              <Button onClick={addCategorySection}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category Section
              </Button>
            </div>

            {settings?.homePageSections?.categoryProducts?.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4" />
                      Category Section {index + 1}
                      {section.categoryId && (
                        <Badge variant="secondary">
                          {categories.find((c) => c._id === section.categoryId)?.name || "Unknown Category"}
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={section.categoryId || ""}
                        onValueChange={(value) => updateCategorySection(index, { categoryId: value })}
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
                    <div>
                      <Label>Custom Title (Optional)</Label>
                      <Input
                        value={section.title || ""}
                        onChange={(e) => updateCategorySection(index, { title: e.target.value })}
                        placeholder="Leave empty to use category name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Design</Label>
                      <Select
                        value={section.design || "category-products-1"}
                        onValueChange={(value) => updateCategorySection(index, { design: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="category-products-1">Standard Grid</SelectItem>
                          <SelectItem value="category-products-2">Featured Grid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Limit</Label>
                      <Input
                        type="number"
                        value={section.limit || 8}
                        onChange={(e) => updateCategorySection(index, { limit: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={section.order || 4 + index}
                        onChange={(e) => updateCategorySection(index, { order: Number.parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!settings?.homePageSections?.categoryProducts ||
              settings.homePageSections.categoryProducts.length === 0) && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No category sections added yet.</p>
                  <Button onClick={addCategorySection}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Category Section
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
