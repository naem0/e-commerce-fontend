"use client"

import { useState, useEffect } from "react"
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui"
import { Trash, Plus, ImageIcon } from "lucide-react"
import { toast } from "react-hot-toast"

export default function VariationManager({
  initialVariations = [],
  onChange,
  variationTypes = [
    { id: "color", name: "Color" },
    { id: "size", name: "Size" },
    { id: "material", name: "Material" },
    { id: "style", name: "Style" },
  ],
}) {
  const [variations, setVariations] = useState(initialVariations.length > 0 ? initialVariations : [])
  const [selectedType, setSelectedType] = useState("")
  const [variationOptions, setVariationOptions] = useState([])
  const [newOption, setNewOption] = useState("")

  // Extract unique variation types from existing variations
  useEffect(() => {
    const types = {}
    variations.forEach((variation) => {
      if (variation.type) {
        types[variation.type] = true
      }
    })

    // Update parent component when variations change
    if (onChange) {
      onChange(variations)
    }
  }, [variations, onChange])

  const handleAddVariationType = () => {
    if (!selectedType) {
      toast.error("Please select a variation type")
      return
    }

    // Check if this type already exists
    const typeExists = variationOptions.some((opt) => opt.type === selectedType)
    if (typeExists) {
      toast.error("This variation type already exists")
      return
    }

    setVariationOptions([
      ...variationOptions,
      {
        type: selectedType,
        options: [],
      },
    ])
    setSelectedType("")
  }

  const handleAddOption = (typeIndex) => {
    if (!newOption) {
      toast.error("Please enter an option value")
      return
    }

    const updatedOptions = [...variationOptions]
    updatedOptions[typeIndex].options.push(newOption)
    setVariationOptions(updatedOptions)
    setNewOption("")

    // Generate variations if we have multiple variation types with options
    generateVariations()
  }

  const handleRemoveOption = (typeIndex, optionIndex) => {
    const updatedOptions = [...variationOptions]
    updatedOptions[typeIndex].options.splice(optionIndex, 1)
    setVariationOptions(updatedOptions)

    // Regenerate variations
    generateVariations()
  }

  const handleRemoveVariationType = (typeIndex) => {
    const updatedOptions = [...variationOptions]
    updatedOptions.splice(typeIndex, 1)
    setVariationOptions(updatedOptions)

    // Regenerate variations
    generateVariations()
  }

  const generateVariations = () => {
    // Only generate if we have variation types with options
    const typesWithOptions = variationOptions.filter((type) => type.options.length > 0)
    if (typesWithOptions.length === 0) {
      setVariations([])
      return
    }

    // Generate all possible combinations
    const generateCombinations = (types, current = {}, index = 0) => {
      if (index === types.length) {
        // Create a variation object with the current combination
        return [
          {
            attributes: { ...current },
            price: 0,
            stock: 0,
            sku: "",
            images: [],
          },
        ]
      }

      const type = types[index]
      const result = []

      for (const option of type.options) {
        const newCurrent = { ...current }
        newCurrent[type.type] = option
        result.push(...generateCombinations(types, newCurrent, index + 1))
      }

      return result
    }

    // Generate new variations while preserving existing data
    const newVariations = generateCombinations(typesWithOptions)

    // Merge with existing variations to preserve data
    const mergedVariations = newVariations.map((newVar) => {
      // Try to find matching existing variation
      const existingVar = variations.find((existing) => {
        // Check if all attributes match
        if (!existing.attributes) return false

        for (const type of typesWithOptions) {
          if (existing.attributes[type.type] !== newVar.attributes[type.type]) {
            return false
          }
        }
        return true
      })

      // If found, preserve its data
      if (existingVar) {
        return {
          ...newVar,
          price: existingVar.price || 0,
          stock: existingVar.stock || 0,
          sku: existingVar.sku || "",
          images: existingVar.images || [],
        }
      }

      return newVar
    })

    setVariations(mergedVariations)
  }

  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...variations]
    updatedVariations[index][field] = value
    setVariations(updatedVariations)
  }

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0]
    if (!file) return

    // Here you would normally upload the file to your server or cloud storage
    // For now, we'll just create a local URL
    const imageUrl = URL.createObjectURL(file)

    const updatedVariations = [...variations]
    if (!updatedVariations[index].images) {
      updatedVariations[index].images = []
    }
    updatedVariations[index].images.push(imageUrl)
    setVariations(updatedVariations)
  }

  const handleRemoveImage = (varIndex, imgIndex) => {
    const updatedVariations = [...variations]
    updatedVariations[varIndex].images.splice(imgIndex, 1)
    setVariations(updatedVariations)
  }

  const getAttributeString = (attributes) => {
    if (!attributes) return ""
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Variation Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {variationTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddVariationType}>Add Type</Button>
          </div>

          {variationOptions.map((type, typeIndex) => (
            <div key={typeIndex} className="mb-6 p-4 border rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">{type.type.charAt(0).toUpperCase() + type.type.slice(1)}</h3>
                <Button variant="destructive" size="sm" onClick={() => handleRemoveVariationType(typeIndex)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2 mb-2">
                <Input
                  placeholder={`Add ${type.type} option`}
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                />
                <Button onClick={() => handleAddOption(typeIndex)}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {type.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center bg-gray-100 rounded-md p-2">
                    <span>{option}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-6 w-6 p-0"
                      onClick={() => handleRemoveOption(typeIndex, optionIndex)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {variations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Variation Combinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {variations.map((variation, index) => (
                <div key={index} className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">{getAttributeString(variation.attributes)}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <Input
                        type="number"
                        value={variation.price}
                        onChange={(e) => handleVariationChange(index, "price", Number.parseFloat(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Stock</label>
                      <Input
                        type="number"
                        value={variation.stock}
                        onChange={(e) => handleVariationChange(index, "stock", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">SKU</label>
                      <Input
                        value={variation.sku}
                        onChange={(e) => handleVariationChange(index, "sku", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Images</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {variation.images &&
                        variation.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative">
                            <img
                              src={img || "/placeholder.svg"}
                              alt={`Variation ${index} image ${imgIndex}`}
                              className="h-20 w-20 object-cover rounded-md"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-0 right-0 h-6 w-6 p-0"
                              onClick={() => handleRemoveImage(index, imgIndex)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                      <label className="flex items-center justify-center h-20 w-20 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e)}
                        />
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
