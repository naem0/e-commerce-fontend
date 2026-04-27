"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, X } from "lucide-react"
import Image from "next/image"

export default function VariationSection({
  formData,
  variationTypes,
  addVariationType,
  removeVariationType,
  handleVariationTypeChange,
  addVariationOption,
  removeVariationOption,
  handleVariationOptionChange,
  variants,
  addVariant,
  removeVariant,
  handleVariantChange,
  handleVariantOptionChange,
  handleVariantImageChange,
  removeVariantImage
}) {
  if (!formData.hasVariations) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p className="text-gray-500">Please enable "This product has variations" in the General tab to manage variations.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Variation Types */}
      <Card className="border-border bg-card/50">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-lg">1. Define Variation Types</CardTitle>
          <p className="text-sm text-muted-foreground">e.g., Color, Size, Material</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {variationTypes.map((type, index) => (
            <div key={index} className="p-4 border border-border rounded-xl bg-muted/20 relative group transition-all hover:bg-muted/30">
              <button
                type="button"
                onClick={() => removeVariationType(index)}
                className="absolute top-3 right-3 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                  <Label htmlFor={`variation-type-name-${index}`}>Type Name</Label>
                  <Input
                    id={`variation-type-name-${index}`}
                    value={type.name}
                    onChange={(e) => handleVariationTypeChange(index, "name", e.target.value)}
                    placeholder="e.g. Color"
                    className="mt-1 bg-background"
                  />
                </div>
                
                <div className="md:col-span-3 space-y-3">
                  <Label>Options</Label>
                  <div className="space-y-3">
                    {type.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex flex-wrap md:flex-nowrap gap-3 items-end">
                        <div className="flex-1 min-w-[120px]">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Option Name</Label>
                          <Input
                            value={option.name}
                            onChange={(e) => handleVariationOptionChange(index, optionIndex, "name", e.target.value)}
                            placeholder="e.g. Red"
                            className="bg-background"
                          />
                        </div>
                        <div className="flex-1 min-w-[120px]">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Value (optional)</Label>
                          <Input
                            value={option.value}
                            onChange={(e) => handleVariationOptionChange(index, optionIndex, "value", e.target.value)}
                            placeholder="e.g. #FF0000"
                            className="bg-background"
                          />
                        </div>
                        <div className="w-32">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Add. Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={option.additionalPrice}
                            onChange={(e) => handleVariationOptionChange(index, optionIndex, "additionalPrice", parseFloat(e.target.value))}
                            placeholder="0.00"
                            className="bg-background"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVariationOption(index, optionIndex)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addVariationOption(index)}
                      className="mt-2 border-dashed"
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addVariationType} variant="secondary" className="w-full border-dashed bg-muted/50 hover:bg-muted text-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Add New Variation Type
          </Button>
        </CardContent>
      </Card>

      {/* Variants List */}
      <Card className="border-border bg-card/50">
        <CardHeader className="bg-muted/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">2. Product Variants</CardTitle>
            <p className="text-sm text-muted-foreground">Configure price and stock for each combination</p>
          </div>
          <Button type="button" onClick={addVariant} size="sm" className="shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {variants.map((variant, index) => (
            <div key={index} className="border border-border rounded-2xl p-6 relative bg-background/50 shadow-sm hover:border-primary/50 transition-all group">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20">
                  VARIANT #{index + 1}
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(index)} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                  {variationTypes.map((type) => (
                    <div key={type.name} className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1 block">{type.name}</Label>
                      <select
                        value={variant.options.find((o) => o.type === type.name)?.value || ""}
                        onChange={(e) => handleVariantOptionChange(index, type.name, e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer dark:bg-zinc-900"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                      >
                        <option value="" disabled className="bg-background">Select {type.name}</option>
                        {type.options.map((option) => (
                          <option key={option.value || option.name} value={option.value || option.name} className="bg-background">
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`v-price-${index}`}>Variant Price (৳)</Label>
                  <Input
                    id={`v-price-${index}`}
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="bg-background font-bold text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`v-stock-${index}`}>Stock Quantity</Label>
                  <Input
                    id={`v-stock-${index}`}
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="bg-background font-bold text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`v-sku-${index}`}>Variant SKU / Code</Label>
                  <Input
                    id={`v-sku-${index}`}
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                    placeholder="e.g. EF-VRT-123"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Variant Images</Label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {variant.imagesPreviews?.map((preview, imgIdx) => (
                    <div key={imgIdx} className="relative aspect-square group/img">
                      <Image src={preview} alt="variant" fill className="object-cover rounded-xl border border-border shadow-sm" />
                      <button
                        type="button"
                        onClick={() => removeVariantImage(index, imgIdx)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleVariantImageChange(index, e)}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3 bg-muted/20 px-4 py-2 rounded-full border border-border">
                  <Switch
                    id={`v-default-${index}`}
                    checked={variant.isDefault}
                    onCheckedChange={(checked) => handleVariantChange(index, "isDefault", checked)}
                  />
                  <Label htmlFor={`v-default-${index}`} className="font-semibold text-sm cursor-pointer">Main Default Variant</Label>
                </div>
                
                <select
                  value={variant.status}
                  onChange={(e) => handleVariantChange(index, "status", e.target.value)}
                  className="text-sm border border-border rounded-full px-4 py-2 bg-background font-medium hover:border-primary transition-colors outline-none cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          ))}
          {variants.length === 0 && (
            <div className="text-center p-12 bg-muted/10 rounded-2xl border-2 border-dashed border-border">
                <p className="text-muted-foreground mb-4">No variants added yet. Use the button above to add your first variant.</p>
                <Button type="button" onClick={addVariant} variant="outline" className="border-primary/50 hover:bg-primary/5">Add First Variant</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
