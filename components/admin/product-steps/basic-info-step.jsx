"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import RichTextEditor from "@/components/ui/rich-text-editor"

export default function BasicInfoStep({ formData, errors, categories, brands, onChange, onRichTextChange }) {
    return (
        <div className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
                <Label htmlFor="name">
                    Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    placeholder="Enter product name"
                    className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Short Description */}
            <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={onChange}
                    placeholder="Brief product description (optional)"
                />
            </div>

            {/* Full Description */}
            <div className="space-y-2">
                <Label htmlFor="description">
                    Full Description <span className="text-red-500">*</span>
                </Label>
                <RichTextEditor
                    value={formData.description}
                    onChange={(value) => onRichTextChange("description", value)}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Price Section */}
            <Card>
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">
                                Price <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={onChange}
                                placeholder="0.00"
                                className={errors.price ? "border-red-500" : ""}
                            />
                            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comparePrice">Compare at Price (Optional)</Label>
                            <Input
                                id="comparePrice"
                                name="comparePrice"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.comparePrice}
                                onChange={onChange}
                                placeholder="0.00"
                            />
                            <p className="text-xs text-muted-foreground">Original price for showing discounts</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">
                        Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => onChange({ target: { name: "category", value } })}>
                        <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="brand">Brand (Optional)</Label>
                    <Select value={formData.brand} onValueChange={(value) => onChange({ target: { name: "brand", value } })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                            {brands.map((brand) => (
                                <SelectItem key={brand._id} value={brand._id}>
                                    {brand.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
