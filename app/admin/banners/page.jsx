"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, Eye, AlertCircle, ImageIcon } from "lucide-react"
import { getBanners, createBanner, updateBanner, deleteBanner } from "@/services/banner.service"
import { useToast } from "@/hooks/use-toast"

export default function BannersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "Shop Now",
    buttonLink: "/products",
    backgroundColor: "#f8fafc",
    textColor: "#1e293b",
    enabled: true,
    image: "",
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/admin/banners")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/")
    }
  }, [status, session, router])

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getBanners()
        if (result.success) {
          setBanners(result.banners)
        } else {
          throw new Error(result.message || "Failed to fetch banners")
        }
      } catch (error) {
        console.error("Error fetching banners:", error)
        setError("Failed to load banners. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load banners",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchBanners()
    }
  }, [status, session, toast])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewBanner((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (checked) => {
    setNewBanner((prev) => ({
      ...prev,
      enabled: checked,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)

      if (!newBanner.title) {
        throw new Error("Banner title is required")
      }

      if (!imageFile && !newBanner.image) {
        throw new Error("Banner image is required")
      }

      const formData = new FormData()
      Object.keys(newBanner).forEach((key) => {
        formData.append(key, newBanner[key])
      })

      if (imageFile) {
        formData.append("image", imageFile)
      }

      const result = await createBanner(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Banner created successfully",
        })
        setBanners((prev) => [...prev, result.banner])
        setNewBanner({
          title: "",
          subtitle: "",
          description: "",
          buttonText: "Shop Now",
          buttonLink: "/products",
          backgroundColor: "#f8fafc",
          textColor: "#1e293b",
          enabled: true,
          image: "",
        })
        setImageFile(null)
        setImagePreview("")
      } else {
        throw new Error(result.message || "Failed to create banner")
      }
    } catch (error) {
      console.error("Error creating banner:", error)
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

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      setLoading(true)
      const result = await deleteBanner(id)
      if (result.success) {
        setBanners((prev) => prev.filter((banner) => banner._id !== id))
        toast({
          title: "Success",
          description: "Banner deleted successfully",
        })
      } else {
        throw new Error(result.message || "Failed to delete banner")
      }
    } catch (error) {
      console.error("Error deleting banner:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (banner) => {
    try {
      setLoading(true)
      const updatedBanner = { ...banner, enabled: !banner.enabled }
      const result = await updateBanner(banner._id, updatedBanner)
      if (result.success) {
        setBanners((prev) => prev.map((b) => (b._id === banner._id ? { ...b, enabled: !b.enabled } : b)))
        toast({
          title: "Success",
          description: `Banner ${updatedBanner.enabled ? "enabled" : "disabled"} successfully`,
        })
      } else {
        throw new Error(result.message || "Failed to update banner")
      }
    } catch (error) {
      console.error("Error updating banner:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredBanners = banners.filter((banner) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return banner.enabled
    if (activeTab === "inactive") return !banner.enabled
    return true
  })

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ImageIcon className="w-8 h-8" />
            Banner Management
          </h1>
          <p className="text-muted-foreground">Create and manage banners for your store</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Banners</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="new">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <BannersList banners={filteredBanners} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <BannersList banners={filteredBanners} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <BannersList banners={filteredBanners} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Banner</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Banner Title*</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newBanner.title}
                      onChange={handleInputChange}
                      placeholder="Enter banner title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      name="subtitle"
                      value={newBanner.subtitle}
                      onChange={handleInputChange}
                      placeholder="Enter banner subtitle"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newBanner.description}
                    onChange={handleInputChange}
                    placeholder="Enter banner description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buttonText">Button Text</Label>
                    <Input
                      id="buttonText"
                      name="buttonText"
                      value={newBanner.buttonText}
                      onChange={handleInputChange}
                      placeholder="Shop Now"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buttonLink">Button Link</Label>
                    <Input
                      id="buttonLink"
                      name="buttonLink"
                      value={newBanner.buttonLink}
                      onChange={handleInputChange}
                      placeholder="/products"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="backgroundColor"
                        name="backgroundColor"
                        value={newBanner.backgroundColor}
                        onChange={handleInputChange}
                        className="w-12 h-10"
                      />
                      <Input
                        type="text"
                        value={newBanner.backgroundColor}
                        onChange={handleInputChange}
                        name="backgroundColor"
                        placeholder="#f8fafc"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="textColor"
                        name="textColor"
                        value={newBanner.textColor}
                        onChange={handleInputChange}
                        className="w-12 h-10"
                      />
                      <Input
                        type="text"
                        value={newBanner.textColor}
                        onChange={handleInputChange}
                        name="textColor"
                        placeholder="#1e293b"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Banner Image*</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="border border-gray-300 rounded-md"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-1">Preview:</p>
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Banner preview"
                          className="max-w-full h-auto max-h-40 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="enabled">Enable Banner</Label>
                  <Switch id="enabled" checked={newBanner.enabled} onCheckedChange={handleSwitchChange} />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Creating..." : "Create Banner"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BannersList({ banners, onDelete, onToggleStatus }) {
  const router = useRouter()

  if (!banners || banners.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No banners found</h3>
        <p className="text-muted-foreground mt-1">Create your first banner to display on your store</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Button</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner._id}>
              <TableCell>
                <div className="w-16 h-12 relative">
                  <img
                    src={
                      banner.image.startsWith("/") ? `${process.env.NEXT_PUBLIC_API_URL}${banner.image}` : banner.image
                    }
                    alt={banner.title}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=48&width=64"
                    }}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{banner.title}</p>
                  {banner.subtitle && <p className="text-xs text-gray-500">{banner.subtitle}</p>}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={banner.enabled ? "success" : "secondary"}>
                  {banner.enabled ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-md">{banner.buttonText}</span>
                  <span className="text-xs text-gray-500">{banner.buttonLink}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(banner)}
                    title={banner.enabled ? "Disable" : "Enable"}
                  >
                    <Switch checked={banner.enabled} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/admin/banners/${banner._id}`)}
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/admin/banners/edit/${banner._id}`)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(banner._id)}
                    title="Delete"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
