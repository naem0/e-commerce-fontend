"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { createProduct } from "@/services/product.service"
import { getCategories } from "@/services/category.service"
import { getBrands } from "@/services/brand.service"

import GeneralInfoSection from "@/components/admin/product-form/GeneralInfoSection"
import ImageSection from "@/components/admin/product-form/ImageSection"
import VariationSection from "@/components/admin/product-form/VariationSection"
import InventorySection from "@/components/admin/product-form/InventorySection"
import AdvancedSection from "@/components/admin/product-form/AdvancedSection"

export default function CreateProductPage() {
  const router = useRouter()
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
    videoUrl: "",
    featured: false,
    status: "draft",
    sku: "",
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    tags: "",
    hasVariations: false,
    seo: { title: "", description: "", keywords: "" },
    specification: "",
    shipping: {
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      free: false,
      insideDhakaCharge: 70,
      outsideDhakaCharge: 120,
      shippingClass: "",
    },
  })

  // Media state
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
    const fetchInitialData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getCategories({ status: "active" }),
          getBrands({ status: "active" })
        ])
        setCategories(catRes.categories || [])
        setBrands(brandRes.brands || [])
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load initial data.")
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === "checkbox" ? checked : value

    setFormData(prev => {
      const keys = name.split(".")
      if (keys.length === 1) return { ...prev, [name]: val }
      
      const updated = { ...prev }
      let temp = updated
      for (let i = 0; i < keys.length - 1; i++) {
        temp[keys[i]] = { ...temp[keys[i]] }
        temp = temp[keys[i]]
      }
      temp[keys[keys.length - 1]] = val
      return updated
    })
  }

  // Media Handlers
  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files)
    setNewImages(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => setNewImagesPreviews(prev => [...prev, reader.result])
      reader.readAsDataURL(file)
    })
  }
  const removeNewImage = (idx) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx))
    setNewImagesPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  // Variation Handlers
  const addVariationType = () => setVariationTypes(prev => [...prev, { name: "", options: [{ name: "", value: "", additionalPrice: 0 }] }])
  const removeVariationType = (idx) => setVariationTypes(prev => prev.filter((_, i) => i !== idx))
  const handleVariationTypeChange = (idx, field, val) => {
    const updated = [...variationTypes]
    updated[idx][field] = val
    setVariationTypes(updated)
  }
  const addVariationOption = (tIdx) => {
    const updated = [...variationTypes]
    updated[tIdx].options.push({ name: "", value: "", additionalPrice: 0 })
    setVariationTypes(updated)
  }
  const removeVariationOption = (tIdx, oIdx) => {
    const updated = [...variationTypes]
    updated[tIdx].options.splice(oIdx, 1)
    setVariationTypes(updated)
  }
  const handleVariationOptionChange = (tIdx, oIdx, field, val) => {
    const updated = [...variationTypes]
    updated[tIdx].options[oIdx][field] = val
    setVariationTypes(updated)
  }

  // Variant Handlers
  const addVariant = () => setVariants(prev => [...prev, {
    sku: "", price: formData.price, stock: formData.stock,
    options: variationTypes.map(t => ({ type: t.name, value: t.options[0]?.value || t.options[0]?.name || "" })),
    images: [], imagesPreviews: [], isDefault: prev.length === 0, status: "active"
  }])
  const removeVariant = (idx) => setVariants(prev => prev.filter((_, i) => i !== idx))
  const handleVariantChange = (idx, field, val) => {
    const updated = [...variants]
    if (field === "isDefault" && val) updated.forEach((v, i) => v.isDefault = i === idx)
    else updated[idx][field] = val
    setVariants(updated)
  }
  const handleVariantOptionChange = (vIdx, type, val) => {
    const updated = [...variants]
    const optIdx = updated[vIdx].options.findIndex(o => o.type === type)
    if (optIdx >= 0) updated[vIdx].options[optIdx].value = val
    else updated[vIdx].options.push({ type, value: val })
    setVariants(updated)
  }
  const handleVariantImageChange = (vIdx, e) => {
    const files = Array.from(e.target.files)
    const updated = [...variants]
    updated[vIdx].images = [...(updated[vIdx].images || []), ...files]
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        updated[vIdx].imagesPreviews = [...(updated[vIdx].imagesPreviews || []), reader.result]
        setVariants([...updated])
      }
      reader.readAsDataURL(file)
    })
  }
  const removeVariantImage = (vIdx, iIdx) => {
    const updated = [...variants]
    updated[vIdx].images.splice(iIdx, 1)
    updated[vIdx].imagesPreviews.splice(iIdx, 1)
    setVariants(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    window.scrollTo({ top: 0, behavior: "smooth" })
    
    try {
      const data = { ...formData, newImages: newImages }
      if (data.tags && typeof data.tags === 'string') data.tags = data.tags.split(",").map(t => t.trim())
      if (data.seo.keywords && typeof data.seo.keywords === 'string') data.seo.keywords = data.seo.keywords.split(",").map(t => t.trim())

      if (data.hasVariations) {
        // Ensure every variation option has a value (default to name if empty)
        const sanitizedVariationTypes = variationTypes.map(vt => ({
          ...vt,
          options: vt.options.map(opt => ({
            ...opt,
            value: opt.value || opt.name
          }))
        }))
        
        data.variationTypes = sanitizedVariationTypes
        data.variants = variants.map(v => {
          const { imagesPreviews, ...vRest } = v
          return {
            ...vRest,
            price: Number(v.price),
            stock: Number(v.stock),
            newImages: v.images // All images in create mode are new
          }
        })
      }

      const res = await createProduct(data)
      if (res.success) {
        toast({ title: "Success", description: "Product created successfully" })
        router.push("/admin/products")
      } else {
        const errorMessage = res.error || res.message || "Failed to create product."
        setError(errorMessage)
        toast({ title: "Error", description: errorMessage, variant: "destructive" })
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to create product."
      setError(errorMessage)
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const tabOrder = ["general", "images", "variations", "inventory", "advanced"]
  
  const handleNext = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1])
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1])
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10" /></div>

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          Add New Product
        </h1>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" onClick={() => router.push("/admin/products")} className="flex-1 md:flex-none">Cancel</Button>
          {activeTab === "advanced" && (
            <Button onClick={handleSubmit} disabled={submitting} className="flex-1 md:flex-none shadow-lg shadow-primary/20">
              {submitting && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
              Create Product
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
        {error && <div className="bg-destructive/10 p-4 border-b border-destructive/20 text-destructive flex items-center gap-2 font-medium"><AlertCircle size={20}/>{error}</div>}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="bg-muted/30 border-b px-6 pt-2">
            <TabsList className="bg-transparent gap-4 h-12">
              {tabOrder.map(tab => (
                <TabsTrigger 
                  key={tab} 
                  value={tab} 
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm capitalize px-6 rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary transition-all"
                >
                  {tab === 'inventory' ? 'Inventory & Shipping' : tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-4 md:p-8">
            <TabsContent value="general" className="mt-0 outline-none"><GeneralInfoSection formData={formData} setFormData={setFormData} handleChange={handleChange} categories={categories} brands={brands} /></TabsContent>
            <TabsContent value="images" className="mt-0 outline-none"><ImageSection formData={formData} handleChange={handleChange} existingImages={[]} removeExistingImage={()=>{}} handleNewImagesChange={handleNewImagesChange} newImagesPreviews={newImagesPreviews} removeNewImage={removeNewImage} /></TabsContent>
            <TabsContent value="variations" className="mt-0 outline-none"><VariationSection formData={formData} variationTypes={variationTypes} addVariationType={addVariationType} removeVariationType={removeVariationType} handleVariationTypeChange={handleVariationTypeChange} addVariationOption={addVariationOption} removeVariationOption={removeVariationOption} handleVariationOptionChange={handleVariationOptionChange} variants={variants} addVariant={addVariant} removeVariant={removeVariant} handleVariantChange={handleVariantChange} handleVariantOptionChange={handleVariantOptionChange} handleVariantImageChange={handleVariantImageChange} removeVariantImage={removeVariantImage} /></TabsContent>
            <TabsContent value="inventory" className="mt-0 outline-none"><InventorySection formData={formData} setFormData={setFormData} handleChange={handleChange} /></TabsContent>
            <TabsContent value="advanced" className="mt-0 outline-none"><AdvancedSection formData={formData} handleChange={handleChange} /></TabsContent>
          </div>

          <div className="bg-muted/20 px-8 py-6 border-t flex items-center justify-between">
            <div className="flex gap-2">
              {activeTab !== "general" && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Previous Step
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {activeTab !== "advanced" ? (
                <Button type="button" onClick={handleNext} className="min-w-[120px]">
                  Next Step
                </Button>
              ) : (
                <Button type="submit" disabled={submitting} className="min-w-[150px] shadow-lg shadow-primary/20">
                  {submitting && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
                  Create Product
                </Button>
              )}
            </div>
          </div>
        </Tabs>
      </form>
    </div>
  )
}
