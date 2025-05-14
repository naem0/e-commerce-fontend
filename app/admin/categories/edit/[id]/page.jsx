"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { categoryService } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"

export default function EditCategoryPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
    status: "active",
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [parentCategories, setParentCategories] = useState([])

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await categoryService.getCategory(id)
        const category = response.category
        setFormData({
          name: category.name,
          description: category.description || "",
          parent: category.parent?._id || "",
          status: category.status,
        })
        if (category.image) {
          setImagePreview(`${process.env.NEXT_PUBLIC_API_URL}${category.image}`)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching category:", error)
        setError("Failed to load category. Please try again.")
        setLoading(false)
      }
    }

    const fetchParentCategories = async () => {
      try {
        const response = await categoryService.getCategories({ parent: "null" })
        // Filter out the current category to prevent circular reference
        setParentCategories(response.categories.filter((category) => category._id !== id))
      } catch (error) {
        console.error("Error fetching parent categories:", error)
      }
    }

    fetchCategory()
    fetchParentCategories()
  }, [id])

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
    setSubmitting(true)
    setError("")

    try {
      const categoryData = { ...formData }
      if (image) {
        categoryData.image = image
      }

      await categoryService.updateCategory(id, categoryData)
      router.push("/admin/categories")
    } catch (error) {
      console.error("Error updating category:", error)
      setError(error.response?.data?.message || "Failed to update category. Please try again.")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Category</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <Label htmlFor="parent">Parent Category (Optional)</Label>
                <select
                  id="parent"
                  name="parent"
                  value={formData.parent}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">None (Top Level Category)</option>
                  {parentCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description"
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="image">Category Image (Optional)</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="mt-1" />
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
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
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
