"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, Loader2, X } from "lucide-react"
import { getProductById, updateProduct } from "@/services/product.service"
import { getCategories } from "@/services/category.service"
import { getBrands } from "@/services/brand.service"

export default function EditProductPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    category: "",
    brand: "",
    stock: "",
    featured: false,
    status: "draft",
    sku: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
  })
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [newImagesPreviews, setNewImagesPreviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id)
        const product = response.product

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          comparePrice: product.comparePrice ? product.comparePrice.toString() : "",
          category: product.category?._id,
          brand: product.brand ? product.brand?._id : "",
          stock: product.stock.toString(),
          featured: product.featured,
          status: product.status,
          sku: product.sku || "",
          weight: product.weight ? product.weight.toString() : "",
          dimensions: {
            length: product.dimensions?.length ? product.dimensions.length.toString() : "",
            width: product.dimensions?.width ? product.dimensions.width.toString() : "",
            height: product.dimensions?.height ? product.dimensions.height.toString() : "",
          },
        })

        setExistingImages(
          product.images.map((img) => ({
            url: `${process.env.NEXT_PUBLIC_API_URL}${img}`,
            path: img,
          })),
        )

        setLoading(false)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product. Please try again.")
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        setCategories(response.categories)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    const fetchBrands = async () => {
      try {
        const response = await getBrands()
        setBrands(response.brands)
      } catch (error) {
        console.error("Error fetching brands:", error)
      }
    }

    fetchProduct()
    fetchCategories()
    fetchBrands()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

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
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files)
    setNewImages((prevImages) => [...prevImages, ...files])

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImagesPreviews((prevPreviews) => [...prevPreviews, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeExistingImage = (index) => {
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const removeNewImage = (index) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index))
    setNewImagesPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const productData = { ...formData }

      // Handle existing images
      if (existingImages.length > 0) {
        productData.images = existingImages.map((img) => img.path)
      }

      // Add new images if any
      if (newImages.length > 0) {
        productData.images = [...(productData.images || []), ...newImages]
      }

      await updateProduct(id, productData)
      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      setError(error.response?.data?.message || "Failed to update product. Please try again.")
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
        <h1 className="text-2xl font-bold">Edit Product</h1>
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
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="comparePrice">Compare at Price (Optional)</Label>
                  <Input
                    id="comparePrice"
                    name="comparePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.comparePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="brand">Brand (Optional)</Label>
                  <select
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU (Optional)</Label>
                  <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU-123" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Current Images</Label>
                {existingImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          width={100}
                          height={100}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No images available</p>
                )}
              </div>

              <div>
                <Label htmlFor="newImages">Add New Images</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="newImages-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload images</span>
                        <input
                          id="newImages-upload"
                          name="newImages"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleNewImagesChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              {newImagesPreviews.length > 0 && (
                <div>
                  <Label>New Image Previews</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {newImagesPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`New preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Additional Information (Optional)</Label>
                <div className="mt-2 space-y-4 border rounded-md p-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label>Dimensions (cm)</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div>
                        <Input
                          name="dimensions.length"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.dimensions.length}
                          onChange={handleChange}
                          placeholder="Length"
                        />
                      </div>
                      <div>
                        <Input
                          name="dimensions.width"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.dimensions.width}
                          onChange={handleChange}
                          placeholder="Width"
                        />
                      </div>
                      <div>
                        <Input
                          name="dimensions.height"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.dimensions.height}
                          onChange={handleChange}
                          placeholder="Height"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
