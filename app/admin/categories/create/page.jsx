"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { useTranslation } from "@/components/language-provider"
import { getCategories, createCategory } from "@/services/category.service"

export default function CreateCategoryPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
    status: "active",
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [parentCategories, setParentCategories] = useState([])

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await getCategories({ parent: "null" })
        setParentCategories(response.categories)
      } catch (error) {
        console.error("Error fetching parent categories:", error)
        setError("Failed to load parent categories. Please try again.")
      }
    }

    fetchParentCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const categoryData = { ...formData }
      if (image) {
        categoryData.image = image
      }

      await createCategory(categoryData)
      router.push("/admin/categories")
    } catch (error) {
      console.error("Error creating category:", error)
      setError(error.response?.data?.message || "Failed to create category. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>
        <h1 className="text-2xl font-bold">{t("admin.createCategory")}</h1>
      </div>

      <div className="bg-card rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-4 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t("admin.categoryName")}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t("admin.enterCategoryName")}
                  className="bg-background"
                />
              </div>

              <div>
                <Label htmlFor="parent">
                  {t("admin.parentCategory")} ({t("common.optional")})
                </Label>
                <select
                  id="parent"
                  name="parent"
                  value={formData.parent}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                >
                  <option value="">{t("admin.noneTopLevel")}</option>
                  {parentCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="status">{t("common.status")}</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                >
                  <option value="active">{t("common.active")}</option>
                  <option value="inactive">{t("common.inactive")}</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">
                  {t("common.description")} ({t("common.optional")})
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t("admin.enterCategoryDescription")}
                  rows={4}
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="image">
                  {t("admin.categoryImage")} ({t("common.optional")})
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 bg-background"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">{t("common.preview")}:</p>
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Category preview"
                      className="w-full max-w-xs h-auto rounded-md border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("common.create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
