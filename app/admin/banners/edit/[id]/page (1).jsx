"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, ImageIcon, ArrowLeft } from "lucide-react"
import { getBanner, updateBanner } from "@/services/banner.service"
import { useToast } from "@/hooks/use-toast"

export default function EditBannerPage({ params }) {
  const { id } = params
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [banner, setBanner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
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
    const fetchBanner = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getBanner(id)
        if (result.success) {
          setBanner(result.banner)
          if (result.banner.image) {
            setImagePreview(
              result.banner.image.startsWith("/")
                ? `${process.env.NEXT_PUBLIC_API_URL}${result.banner.image}`
                : result.banner.image,
            )
          }
        } else {
          throw new Error(result.message || "Failed to fetch banner")
        }
      } catch (error) {
        console.error("Error fetching banner:", error)
        setError("Failed to load banner. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load banner",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "admin" && id) {
      fetchBanner()
    }
  }, [id, status, session, toast])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBanner((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (checked) => {
    setBanner((prev) => ({
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

      if (!banner.title) {
        throw new Error("Banner title is required")
      }

      const formData = new FormData()
      Object.keys(banner).forEach((key) => {
        if (key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt") {
          formData.append(key, banner[key])
        }
      })

      if (imageFile) {
        formData.append("image", imageFile)
      }

      const result = await updateBanner(id, formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Banner updated successfully",
        })
        router.push("/admin/banners")
      } else {
        throw new Error(result.message || "Failed to update banner")
      }
    } catch (error) {
      console.error("Error updating banner:", error)
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!banner) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Banner not found</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/admin/banners")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Banners
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ImageIcon className="w-8 h-8" />
            Edit Banner
          </h1>
          <p className="text-muted-foreground">Update banner details</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/banners")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Banners
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Banner Title*</Label>
                <Input
                  id="title"
                  name="title"
                  value={banner.title}
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
                  value={banner.subtitle || ""}
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
                value={banner.description || ""}
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
                  value={banner.buttonText || ""}
                  onChange={handleInputChange}
                  placeholder="Shop Now"
                />
              </div>
              <div>
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  name="buttonLink"
                  value={banner.buttonLink || ""}
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
                    value={banner.backgroundColor || "#f8fafc"}
                    onChange={handleInputChange}
                    className="w-12 h-10"
                  />
                  <Input
                    type="text"
                    value={banner.backgroundColor || "#f8fafc"}
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
                    value={banner.textColor || "#1e293b"}
                    onChange={handleInputChange}
                    className="w-12 h-10"
                  />
                  <Input
                    type="text"
                    value={banner.textColor || "#1e293b"}
                    onChange={handleInputChange}
                    name="textColor"
                    placeholder="#1e293b"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="image">Banner Image</Label>
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
                    <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Banner preview"
                      className="max-w-full h-auto max-h-40 rounded-md"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=160&width=320"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="enabled">Enable Banner</Label>
              <Switch id="enabled" checked={banner.enabled} onCheckedChange={handleSwitchChange} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
