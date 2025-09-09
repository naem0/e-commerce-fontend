"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { updateBrand, getBrandById } from "@/services/brand.service"

export default function EditBrandPage({ params }) {
  const router = useRouter()
  const { id } = React.use(params)
  console.log("Editing brand with ID:", id)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    status: "active",
  })
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await getBrandById(id)
        const brand = response.brand
        setFormData({
          name: brand.name,
          description: brand.description || "",
          website: brand.website || "",
          status: brand.status,
        })
        if (brand.logo) {
          setLogoPreview(`${process.env.NEXT_PUBLIC_API_URL}${brand.logo}`)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching brand:", error)
        setError("Failed to load brand. Please try again.")
        setLoading(false)
      }
    }

    fetchBrand()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const brandData = { ...formData }
      if (logo) {
        brandData.logo = logo
      }

      await updateBrand(id, brandData)
      router.push("/admin/brands")
    } catch (error) {
      console.error("Error updating brand:", error)
      setError(error.response?.data?.message || "Failed to update brand. Please try again.")
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
        <h1 className="text-2xl font-bold">Edit Brand</h1>
      </div>

      <div className="bg-card rounded-lg shadow-md p-6">
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
                <Label htmlFor="name">Brand Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 bg-background"
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
                  placeholder="Enter brand description"
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="logo">Brand Logo (Optional)</Label>
                <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="mt-1" />
                {logoPreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Brand logo preview"
                      className="w-full max-w-xs h-auto rounded-md border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/brands")}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Brand
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
