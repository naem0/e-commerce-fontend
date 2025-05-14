"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
  Label,
} from "@/components/ui"

export default function VariationSelector({ variations = [], onVariationSelect, initialSelection = {} }) {
  const [selectedAttributes, setSelectedAttributes] = useState(initialSelection)
  const [availableVariation, setAvailableVariation] = useState(null)
  const [attributeTypes, setAttributeTypes] = useState([])
  const [attributeOptions, setAttributeOptions] = useState({})

  // Extract all attribute types and their options from variations
  useEffect(() => {
    if (!variations || variations.length === 0) return

    const types = new Set()
    const options = {}

    variations.forEach((variation) => {
      if (variation.attributes) {
        Object.entries(variation.attributes).forEach(([type, value]) => {
          types.add(type)

          if (!options[type]) {
            options[type] = new Set()
          }
          options[type].add(value)
        })
      }
    })

    setAttributeTypes(Array.from(types))

    const formattedOptions = {}
    Object.entries(options).forEach(([type, values]) => {
      formattedOptions[type] = Array.from(values)
    })
    setAttributeOptions(formattedOptions)

    // If we have initial selection, find the matching variation
    if (Object.keys(initialSelection).length > 0) {
      findMatchingVariation(initialSelection)
    }
  }, [variations, initialSelection])

  const handleAttributeChange = (type, value) => {
    const newSelection = { ...selectedAttributes, [type]: value }
    setSelectedAttributes(newSelection)
    findMatchingVariation(newSelection)
  }

  const findMatchingVariation = (attributes) => {
    // Check if we have selected all required attributes
    const selectedTypes = Object.keys(attributes)
    if (selectedTypes.length !== attributeTypes.length) {
      setAvailableVariation(null)
      if (onVariationSelect) onVariationSelect(null)
      return
    }

    // Find a variation that matches all selected attributes
    const matchingVariation = variations.find((variation) => {
      if (!variation.attributes) return false

      return selectedTypes.every((type) => variation.attributes[type] === attributes[type])
    })

    setAvailableVariation(matchingVariation)
    if (onVariationSelect) onVariationSelect(matchingVariation)
  }

  // Get available options for a specific attribute type based on current selections
  const getAvailableOptions = (type) => {
    // If no other attributes are selected, return all options for this type
    const otherSelectedTypes = Object.keys(selectedAttributes).filter((t) => t !== type)
    if (otherSelectedTypes.length === 0) {
      return attributeOptions[type] || []
    }

    // Otherwise, find options that are compatible with other selections
    const availableOptions = new Set()

    variations.forEach((variation) => {
      if (!variation.attributes) return

      // Check if this variation matches our other selected attributes
      const matches = otherSelectedTypes.every((t) => variation.attributes[t] === selectedAttributes[t])

      if (matches && variation.attributes[type]) {
        availableOptions.add(variation.attributes[type])
      }
    })

    return Array.from(availableOptions)
  }

  // Determine if an option should be disabled
  const isOptionDisabled = (type, option) => {
    const availableOptions = getAvailableOptions(type)
    return !availableOptions.includes(option)
  }

  // Render color swatches for color attribute
  const renderColorOptions = (type, options) => {
    return (
      <RadioGroup
        value={selectedAttributes[type] || ""}
        onValueChange={(value) => handleAttributeChange(type, value)}
        className="flex flex-wrap gap-2 mt-2"
      >
        {options.map((option) => {
          const disabled = isOptionDisabled(type, option)
          return (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${type}-${option}`} disabled={disabled} className="peer sr-only" />
              <Label
                htmlFor={`${type}-${option}`}
                className={`
                  h-8 w-8 rounded-full border-2 cursor-pointer flex items-center justify-center
                  ${selectedAttributes[type] === option ? "border-black" : "border-gray-200"}
                  ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-300"}
                `}
                style={{ backgroundColor: option.toLowerCase() }}
              >
                {selectedAttributes[type] === option && <span className="text-white text-xs">✓</span>}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    )
  }

  // Render size options
  const renderSizeOptions = (type, options) => {
    return (
      <RadioGroup
        value={selectedAttributes[type] || ""}
        onValueChange={(value) => handleAttributeChange(type, value)}
        className="flex flex-wrap gap-2 mt-2"
      >
        {options.map((option) => {
          const disabled = isOptionDisabled(type, option)
          return (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${type}-${option}`} disabled={disabled} className="peer sr-only" />
              <Label
                htmlFor={`${type}-${option}`}
                className={`
                  h-10 min-w-10 px-3 rounded-md border-2 cursor-pointer flex items-center justify-center
                  ${selectedAttributes[type] === option ? "border-black bg-gray-100" : "border-gray-200"}
                  ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-300"}
                `}
              >
                {option}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    )
  }

  // Render dropdown for other attribute types
  const renderDropdownOptions = (type, options) => {
    return (
      <Select value={selectedAttributes[type] || ""} onValueChange={(value) => handleAttributeChange(type, value)}>
        <SelectTrigger className="w-full mt-2">
          <SelectValue placeholder={`Select ${type}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option} disabled={isOptionDisabled(type, option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (!variations || variations.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {attributeTypes.map((type) => {
        const options = attributeOptions[type] || []

        return (
          <div key={type} className="space-y-2">
            <h3 className="text-sm font-medium capitalize">{type}</h3>

            {type.toLowerCase() === "color" && renderColorOptions(type, options)}
            {type.toLowerCase() === "size" && renderSizeOptions(type, options)}
            {type.toLowerCase() !== "color" && type.toLowerCase() !== "size" && renderDropdownOptions(type, options)}
          </div>
        )
      })}

      {availableVariation && (
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Price:</span>
            <span className="text-sm font-bold">${availableVariation.price.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mt-1">
            <span className="text-sm font-medium">Availability:</span>
            <span className={`text-sm font-medium ${availableVariation.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {availableVariation.stock > 0 ? `In Stock (${availableVariation.stock})` : "Out of Stock"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
