"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, ArrowLeft, Loader2, Plus, Trash2, X } from "lucide-react"
import { getProductById, updateProduct } from "@/services/product.service"
import { getCategories } from "@/services/category.service"
import { getBrands } from "@/services/brand.service"
import RichTextEditor from "@/components/ui/rich-text-editor"
import Image from "next/image"

export default function EditProductPage({ params }) {
  const router = useRouter()
  const { id } = params
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
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
    tags: "",
    hasVariations: false,
    seo: {
      title: "",
      description: "",
      keywords: "",
    },
    specification: "",
    shipping: {
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
      freeShipping: false,
      shippingClass: "",
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

  // Variation state
  const [variationTypes, setVariationTypes] = useState([])
  const [variants, setVariants] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id)
        const product = response.product

        setFormData({
          name: product.name || "",
          description: product.description || "",
          shortDescription: product.shortDescription || "",
          price: product.price?.toString() || "",
          comparePrice: product.comparePrice?.toString() || "",
          category: product.category?._id || "",
          brand: product.brand?._id || "",
          stock: product.stock?.toString() || "",
          featured: product.featured || false,
          status: product.status || "draft",
          sku: product.sku || "",
          weight: product.weight?.toString() || "",
          dimensions: {
            length: product.dimensions?.length?.toString() || "",
            width: product.dimensions?.width?.toString() || "",
            height: product.dimensions?.height?.toString() || "",
          },
          tags: product.tags?.join(", ") || "",
          hasVariations: product.hasVariations || false,
          seo: {
            title: product.seo?.title || "",
            description: product.seo?.description || "",
            keywords: product.seo?.keywords?.join(", ") || "",
          },
          specification: product.specification || "",
          shipping: {
            weight: product.shipping?.weight?.toString() || "",
            dimensions: {
              length: product.shipping?.dimensions?.length?.toString() || "",
              width: product.shipping?.dimensions?.width?.toString() || "",
              height: product.shipping?.dimensions?.height?.toString() || "",
            },
            freeShipping: product.shipping?.freeShipping || false,
            shippingClass: product.shipping?.shippingClass || "",
          },
        })

        if (product.images) {
          setExistingImages(
            product.images.map((img) => ({
              url: `${process.env.NEXT_PUBLIC_API_URL}${img}`,
              path: img,
            })),
          )
        }

        if (product.hasVariations) {
          setVariationTypes(product.variationTypes || [])
          setVariants(
            product.variants.map((variant) => ({
              ...variant,
              price: variant.price?.toString() || "",
              comparePrice: variant.comparePrice?.toString() || "",
              stock: variant.stock?.toString() || "",
              imagesPreviews: variant.images?.map((img) => `${process.env.NEXT_PUBLIC_API_URL}${img}`) || [],
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await getCategories({ status: "active" })
        setCategories(response.categories)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load categories. Please try again.")
      }
    }

    const fetchBrands = async () => {
      try {
        const response = await getBrands({ status: "active" })
        setBrands(response.brands)
      } catch (error) {
        console.error("Error fetching brands:", error)
        setError("Failed to load brands. Please try again.")
      }
    }

    fetchProduct()
    fetchCategories()
    fetchBrands()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    const processedValue = type === "checkbox" ? checked : value

    setFormData((prev) => {
      const newFormData = { ...prev }
      const keys = name.split(".")
      let temp = newFormData

      for (let i = 0; i < keys.length - 1; i++) {
        temp = temp[keys[i]]
      }

      temp[keys[keys.length - 1]] = processedValue
      return newFormData
    })
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

  // Variation type handlers
  const addVariationType = () => {
    setVariationTypes((prev) => [
      ...prev,
      { name: "", options: [{ name: "", value: "", additionalPrice: 0, image: "" }] },
    ])
  }

  const removeVariationType = (index) => {
    setVariationTypes((prev) => prev.filter((_, i) => i !== index))

    // Update variants to remove this variation type
    const updatedVariants = [...variants]
    updatedVariants.forEach((variant) => {
      variant.options = variant.options.filter((option) => option.type !== variationTypes[index].name)
    })
    setVariants(updatedVariants)
  }

  const handleVariationTypeChange = (index, field, value) => {
    const updatedTypes = [...variationTypes]

    // If changing the name, update all variant options that use this type
    if (field === "name") {
      const oldName = updatedTypes[index].name
      updatedTypes[index].name = value

      // Update all variants that use this type
      const updatedVariants = [...variants]
      updatedVariants.forEach((variant) => {
        variant.options.forEach((option) => {
          if (option.type === oldName) {
            option.type = value
          }
        })
      })
      setVariants(updatedVariants)
    } else {
      updatedTypes[index][field] = value
    }

    setVariationTypes(updatedTypes)
  }

  // Variation option handlers
  const addVariationOption = (typeIndex) => {
    const updatedTypes = [...variationTypes]
    updatedTypes[typeIndex].options.push({ name: "", value: "", additionalPrice: 0, image: "" })
    setVariationTypes(updatedTypes)
  }

  const removeVariationOption = (typeIndex, optionIndex) => {
    const updatedTypes = [...variationTypes]
    const optionToRemove = updatedTypes[typeIndex].options[optionIndex]
    updatedTypes[typeIndex].options.splice(optionIndex, 1)
    setVariationTypes(updatedTypes)

    // Remove variants that use this option
    const updatedVariants = variants.filter((variant) => {
      return !variant.options.some(
        (option) => option.type === updatedTypes[typeIndex].name && option.value === optionToRemove.value,
      )
    })
    setVariants(updatedVariants)
  }

  const handleVariationOptionChange = (typeIndex, optionIndex, field, value) => {
    const updatedTypes = [...variationTypes]

    // If changing the value, update all variant options that use this value
    if (field === "value") {
      const oldValue = updatedTypes[typeIndex].options[optionIndex].value
      const typeName = updatedTypes[typeIndex].name
      updatedTypes[typeIndex].options[optionIndex].value = value

      // Update all variants that use this option
      const updatedVariants = [...variants]
      updatedVariants.forEach((variant) => {
        variant.options.forEach((option) => {
          if (option.type === typeName && option.value === oldValue) {
            option.value = value
          }
        })
      })
      setVariants(updatedVariants)
    } else {
      updatedTypes[typeIndex].options[optionIndex][field] = value
    }

    setVariationTypes(updatedTypes)
  }

  // Variant handlers
  const addVariant = () => {
    // Create a new variant with default options from each variation type
    const newVariant = {
      sku: "",
      price: formData.price,
      comparePrice: formData.comparePrice,
      stock: formData.stock,
      options: variationTypes.map((type) => ({
        type: type.name,
        value: type.options[0]?.value || "",
      })),
      images: [],
      imagesPreviews: [],
      isDefault: variants.length === 0,
      status: "active",
    }
    setVariants((prev) => [...prev, newVariant])
  }

  const removeVariant = (index) => {
    // Don't allow removing the last variant
    if (variants.length <= 1) {
      toast({
        title: "Cannot remove variant",
        description: "A product with variations must have at least one variant.",
        variant: "destructive",
      })
      return
    }

    const updatedVariants = [...variants]
    updatedVariants.splice(index, 1)

    // If we removed the default variant, set the first one as default
    if (variants[index].isDefault && updatedVariants.length > 0) {
      updatedVariants[0].isDefault = true
    }

    setVariants(updatedVariants)
  }

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants]

    if (field === "isDefault" && value === true) {
      // Unset default on all other variants
      updatedVariants.forEach((variant, i) => {
        variant.isDefault = i === index
      })
    } else {
      updatedVariants[index][field] = value
    }

    setVariants(updatedVariants)
  }

  const handleVariantOptionChange = (variantIndex, optionType, optionValue) => {
    const updatedVariants = [...variants]
    const optionIndex = updatedVariants[variantIndex].options.findIndex((o) => o.type === optionType)

    if (optionIndex >= 0) {
      updatedVariants[variantIndex].options[optionIndex].value = optionValue
    } else {
      updatedVariants[variantIndex].options.push({ type: optionType, value: optionValue })
    }

    setVariants(updatedVariants)
  }

  const handleVariantImageChange = (variantIndex, e) => {
    const files = Array.from(e.target.files)
    const updatedVariants = [...variants]

    // Add to existing images
    updatedVariants[variantIndex].images = [...(updatedVariants[variantIndex].images || []), ...files]

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        updatedVariants[variantIndex].imagesPreviews = [
          ...(updatedVariants[variantIndex].imagesPreviews || []),
          reader.result,
        ]
        setVariants([...updatedVariants])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variants]
    updatedVariants[variantIndex].images.splice(imageIndex, 1)
    updatedVariants[variantIndex].imagesPreviews.splice(imageIndex, 1)
    setVariants(updatedVariants)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const productData = { ...formData }

      // Format tags
      if (productData.tags && typeof productData.tags === "string") {
        productData.tags = productData.tags.split(",").map((tag) => tag.trim())
      }
      if (productData.seo.keywords && typeof productData.seo.keywords === "string") {
        productData.seo.keywords = productData.seo.keywords.split(",").map((tag) => tag.trim())
      }

      // Handle images
      productData.images = existingImages.map((img) => img.path)
      if (newImages.length > 0) {
        productData.newImages = newImages
      }

      // Add variation data if product has variations
      if (productData.hasVariations) {
        productData.variationTypes = variationTypes

        // Format variants
        productData.variants = variants.map((variant) => {
          const formattedVariant = {
            ...variant,
            price: Number(variant.price),
            stock: Number(variant.stock),
          }

          if (variant.comparePrice) {
            formattedVariant.comparePrice = Number(variant.comparePrice)
          }

          // Separate existing and new images for variants
          const existingVariantImages = variant.images?.filter(img => typeof img === 'string') || []
          const newVariantImages = variant.images?.filter(img => typeof img !== 'string') || []
          
          formattedVariant.images = existingVariantImages
          if (newVariantImages.length > 0) {
            formattedVariant.newImages = newVariantImages
          }

          return formattedVariant
        })
      }

      const response = await updateProduct(id, productData)

      if (!response.success) {
        throw new Error(response.message)
      }
      toast({
        title: "Success",
        description: "Product updated successfully",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      setError(error.response?.data?.message || "Failed to update product. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
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

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="variations">Variations</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
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
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Textarea
                      id="shortDescription"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      placeholder="Enter short description"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Full Description</Label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                      placeholder="Enter detailed product description..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="specification">Specification</Label>
                    <RichTextEditor
                      value={formData.specification}
                      onChange={(value) => setFormData((prev) => ({ ...prev, specification: value }))}
                      placeholder="Enter product specifications..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
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

                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="tag1, tag2, tag3"
                    />
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
                    <div className="flex flex-col justify-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          name="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                        />
                        <Label htmlFor="featured">Featured Product</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="hasVariations"
                          name="hasVariations"
                          checked={formData.hasVariations}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, hasVariations: checked }))
                          }
                        />
                        <Label htmlFor="hasVariations">This product has variations</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
              <div>
                <Label>Existing Images</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image.url}
                        alt={`Existing image ${index + 1}`}
                        width={150}
                        height={150}
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
              </div>
              <div>
                <Label htmlFor="images">Add New Images</Label>
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
                        htmlFor="images-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload images</span>
                        <input
                          id="images-upload"
                          name="images"
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
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={150}
                          height={150}
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
            </TabsContent>

            {/* Variations Tab */}
            <TabsContent value="variations">
              {formData.hasVariations ? (
                <div className="space-y-6">
                  {/* Variation Types */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Variation Types</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {variationTypes.map((type, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                          <div>
                            <Label htmlFor={`variation-type-name-${index}`}>Name</Label>
                            <Input
                              id={`variation-type-name-${index}`}
                              type="text"
                              value={type.name}
                              onChange={(e) => handleVariationTypeChange(index, "name", e.target.value)}
                              placeholder="e.g. Color"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Options</Label>
                            <div className="space-y-2">
                              {type.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                                  <div>
                                    <Label htmlFor={`variation-option-name-${index}-${optionIndex}`}>Name</Label>
                                    <Input
                                      id={`variation-option-name-${index}-${optionIndex}`}
                                      type="text"
                                      value={option.name}
                                      onChange={(e) =>
                                        handleVariationOptionChange(index, optionIndex, "name", e.target.value)
                                      }
                                      placeholder="e.g. Red"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`variation-option-value-${index}-${optionIndex}`}>Value</Label>
                                    <Input
                                      id={`variation-option-value-${index}-${optionIndex}`}
                                      type="text"
                                      value={option.value}
                                      onChange={(e) =>
                                        handleVariationOptionChange(index, optionIndex, "value", e.target.value)
                                      }
                                      placeholder="e.g. #FF0000"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`variation-option-price-${index}-${optionIndex}`}>
                                      Additional Price
                                    </Label>
                                    <Input
                                      id={`variation-option-price-${index}-${optionIndex}`}
                                      type="number"
                                      step="0.01"
                                      value={option.additionalPrice}
                                      onChange={(e) =>
                                        handleVariationOptionChange(
                                          index,
                                          optionIndex,
                                          "additionalPrice",
                                          Number.parseFloat(e.target.value),
                                        )
                                      }
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeVariationOption(index, optionIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button type="button" variant="secondary" onClick={() => addVariationOption(index)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
                              </Button>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeVariationType(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" onClick={addVariationType}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variation Type
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Variants */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Variants</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {variants.map((variant, index) => (
                        <div key={index} className="border rounded-md p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Variant #{index + 1}</h3>
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeVariant(index)}>
                              Remove Variant
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`variant-sku-${index}`}>SKU</Label>
                              <Input
                                id={`variant-sku-${index}`}
                                type="text"
                                value={variant.sku}
                                onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                                placeholder="e.g. SKU-RED"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`variant-status-${index}`}>Status</Label>
                              <select
                                id={`variant-status-${index}`}
                                value={variant.status}
                                onChange={(e) => handleVariantChange(index, "status", e.target.value)}
                                className="w-full border rounded-md px-3 py-2"
                              >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor={`variant-price-${index}`}>Price</Label>
                              <Input
                                id={`variant-price-${index}`}
                                type="number"
                                step="0.01"
                                value={variant.price}
                                onChange={(e) =>
                                  handleVariantChange(index, "price", Number.parseFloat(e.target.value))
                                }
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`variant-compare-price-${index}`}>Compare Price</Label>
                              <Input
                                id={`variant-compare-price-${index}`}
                                type="number"
                                step="0.01"
                                value={variant.comparePrice}
                                onChange={(e) =>
                                  handleVariantChange(index, "comparePrice", Number.parseFloat(e.target.value))
                                }
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`variant-stock-${index}`}>Stock</Label>
                              <Input
                                id={`variant-stock-${index}`}
                                type="number"
                                value={variant.stock}
                                onChange={(e) =>
                                  handleVariantChange(index, "stock", Number.parseInt(e.target.value))
                                }
                                placeholder="0"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Options</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {variationTypes.map((type) => (
                                <div key={type.name}>
                                  <Label htmlFor={`variant-option-${index}-${type.name}`}>{type.name}</Label>
                                  <select
                                    id={`variant-option-${index}-${type.name}`}
                                    value={variant.options.find((o) => o.type === type.name)?.value || ""}
                                    onChange={(e) => handleVariantOptionChange(index, type.name, e.target.value)}
                                    className="w-full border rounded-md px-3 py-2"
                                  >
                                    {type.options.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label>Variant Images</Label>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              {variant.imagesPreviews?.map((preview, imageIndex) => (
                                <div key={imageIndex} className="relative">
                                  <Image
                                    src={preview}
                                    alt={`Variant image ${imageIndex + 1}`}
                                    width={100}
                                    height={100}
                                    className="h-24 w-full object-cover rounded-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeVariantImage(index, imageIndex)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`variant-images-${index}`}>Add Variant Images</Label>
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
                                    htmlFor={`variant-images-upload-${index}`}
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                  >
                                    <span>Upload images</span>
                                    <input
                                      id={`variant-images-upload-${index}`}
                                      name="images"
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={(e) => handleVariantImageChange(index, e)}
                                      className="sr-only"
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`variant-default-${index}`}
                              checked={variant.isDefault}
                              onCheckedChange={(checked) => handleVariantChange(index, "isDefault", checked)}
                            />
                            <Label htmlFor={`variant-default-${index}`}>Default Variant</Label>
                          </div>
                        </div>
                      ))}
                      <Button type="button" onClick={addVariant}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variant
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-gray-500">
                  Please enable "This product has variations" in the General tab to manage variations.
                </div>
              )}
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    disabled={formData.hasVariations}
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU (Optional)</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="SKU-123"
                    disabled={formData.hasVariations}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seo-title">Title</Label>
                    <Input
                      id="seo-title"
                      name="seo.title"
                      value={formData.seo.title}
                      onChange={handleChange}
                      placeholder="Enter SEO title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo-description">Description</Label>
                    <Textarea
                      id="seo-description"
                      name="seo.description"
                      value={formData.seo.description}
                      onChange={handleChange}
                      placeholder="Enter SEO description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo-keywords">Keywords (comma separated)</Label>
                    <Input
                      id="seo-keywords"
                      name="seo.keywords"
                      value={formData.seo.keywords}
                      onChange={handleChange}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shipping-weight">Weight (kg)</Label>
                      <Input
                        id="shipping-weight"
                        name="shipping.weight"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.shipping.weight}
                        onChange={handleChange}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label>Dimensions (cm)</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <div>
                          <Input
                            name="shipping.dimensions.length"
                            type="number"
                            step="0.1"
                            min="0"
                            value={formData.shipping.dimensions.length}
                            onChange={handleChange}
                            placeholder="Length"
                          />
                        </div>
                        <div>
                          <Input
                            name="shipping.dimensions.width"
                            type="number"
                            step="0.1"
                            min="0"
                            value={formData.shipping.dimensions.width}
                            onChange={handleChange}
                            placeholder="Width"
                          />
                        </div>
                        <div>
                          <Input
                            name="shipping.dimensions.height"
                            type="number"
                            step="0.1"
                            min="0"
                            value={formData.shipping.dimensions.height}
                            onChange={handleChange}
                            placeholder="Height"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="shipping-free"
                      name="shipping.freeShipping"
                      checked={formData.shipping.freeShipping}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          shipping: { ...prev.shipping, freeShipping: checked },
                        }))
                      }
                    />
                    <Label htmlFor="shipping-free">Free Shipping</Label>
                  </div>

                  <div>
                    <Label htmlFor="shipping-class">Shipping Class (Optional)</Label>
                    <Input
                      id="shipping-class"
                      name="shipping.shippingClass"
                      value={formData.shipping.shippingClass}
                      onChange={handleChange}
                      placeholder="e.g. Standard"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || loading}>
              {(submitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
