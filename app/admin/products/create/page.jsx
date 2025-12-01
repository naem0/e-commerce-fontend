"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ProductFormWizard from "@/components/admin/product-form-wizard"
import BasicInfoStep from "@/components/admin/product-steps/basic-info-step"
import MediaStep from "@/components/admin/product-steps/media-step"
import InventoryStep from "@/components/admin/product-steps/inventory-step"
import AdditionalDetailsStep from "@/components/admin/product-steps/additional-details-step"
import { createProduct } from "@/services/product.service"
import { getCategories } from "@/services/category.service"
import { getBrands } from "@/services/brand.service"

export default function CreateProductPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    specification: "",
    price: "",
    comparePrice: "",
    category: "",
    brand: "",
    stock: "",
    sku: "",
    barcode: "",
    videoUrl: "",
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    tags: [],
    seo: { title: "", description: "" },
    status: "draft",
    featured: false,
  })

  const steps = [
    {
      title: "Basic Info",
      description: "Product name, description & pricing",
    },
    {
      title: "Media",
      description: "Images and video",
    },
    {
      title: "Inventory",
      description: "Stock & product details",
    },
    {
      title: "Additional",
      description: "Tags, SEO & specifications",
    },
  ]

  useEffect(() => {
    fetchCategories()
    fetchBrands()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await getCategories()
      if (response.success) {
        setCategories(response.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await getBrands()
      if (response.success) {
        setBrands(response.brands)
      }
    } catch (error) {
      console.error("Error fetching brands:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleRichTextChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files)
    const remainingSlots = 5 - images.length

    const filesToAdd = files.slice(0, remainingSlots).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setImages((prev) => [...prev, ...filesToAdd])
  }

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 0) {
      // Basic Info validation
      if (!formData.name.trim()) {
        newErrors.name = "Product name is required"
      }
      if (!formData.description.trim()) {
        newErrors.description = "Description is required"
      }
      if (!formData.price || formData.price <= 0) {
        newErrors.price = "Valid price is required"
      }
      if (!formData.category) {
        newErrors.category = "Please select a category"
      }
    } else if (step === 2) {
      // Inventory validation
      if (!formData.stock || formData.stock < 0) {
        newErrors.stock = "Valid stock quantity is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStepChange = (newStep) => {
    // Validate current step before moving forward
    if (newStep > currentStep && !validateStep(currentStep)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setCurrentStep(newStep)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()

    // Validate all steps
    if (!validateStep(currentStep)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const productData = {
        ...formData,
        images: images.map((img) => img.file),
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined,
        stock: Number(formData.stock),
        weight: formData.weight ? Number(formData.weight) : undefined,
      }

      const response = await createProduct(productData)

      if (response.success) {
        toast({
          title: "Success",
          description: "Product created successfully",
        })
        router.push("/admin/products")
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Create New Product</h2>
          <p className="text-muted-foreground">
            Add a new product to your store inventory
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <ProductFormWizard
            steps={steps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          >
            {currentStep === 0 && (
              <BasicInfoStep
                formData={formData}
                errors={errors}
                categories={categories}
                brands={brands}
                onChange={handleChange}
                onRichTextChange={handleRichTextChange}
              />
            )}

            {currentStep === 1 && (
              <MediaStep
                formData={formData}
                images={images}
                videoUrl={formData.videoUrl}
                onImagesChange={handleImagesChange}
                onRemoveImage={handleRemoveImage}
                onVideoUrlChange={handleChange}
              />
            )}

            {currentStep === 2 && (
              <InventoryStep
                formData={formData}
                errors={errors}
                onChange={handleChange}
              />
            )}

            {currentStep === 3 && (
              <AdditionalDetailsStep
                formData={formData}
                onChange={handleChange}
                onRichTextChange={handleRichTextChange}
              />
            )}
          </ProductFormWizard>
        </form>
      </div>
    </div>
  )
}
