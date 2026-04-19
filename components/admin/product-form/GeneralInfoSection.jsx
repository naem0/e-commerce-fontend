"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import RichTextEditor from "@/components/ui/rich-text-editor"

export default function GeneralInfoSection({ formData, setFormData, handleChange, categories, brands }) {
  return (
    <div className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer hover:border-primary/50 appearance-none dark:bg-zinc-900 dark:text-zinc-100"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
              >
                <option value="" className="bg-background text-foreground">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id} className="bg-background text-foreground">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand (Optional)</Label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer hover:border-primary/50 appearance-none dark:bg-zinc-900 dark:text-zinc-100"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
              >
                <option value="" className="bg-background text-foreground">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id} className="bg-background text-foreground">
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="tag1, tag2, tag3"
              className="bg-background border-border text-foreground dark:bg-zinc-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer hover:border-primary/50 appearance-none dark:bg-zinc-900 dark:text-zinc-100"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
              >
                <option value="draft" className="bg-background text-foreground font-medium">Draft</option>
                <option value="published" className="bg-background text-foreground font-medium">Published</option>
                <option value="archived" className="bg-background text-foreground font-medium">Archived</option>
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
    </div>
  )
}
