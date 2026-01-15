"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InventoryStep({ formData, errors, onChange }) {
    return (
        <div className="space-y-6">
            {/* Stock Management */}
            <Card>
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Stock Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stock">
                                Stock Quantity <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={onChange}
                                placeholder="0"
                                className={errors.stock ? "border-red-500" : ""}
                            />
                            {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                            <Input
                                id="sku"
                                name="sku"
                                value={formData.sku}
                                onChange={onChange}
                                placeholder="e.g., PROD-001"
                            />
                            <p className="text-xs text-muted-foreground">Unique identifier for inventory</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="barcode">Barcode (Optional)</Label>
                            <Input
                                id="barcode"
                                name="barcode"
                                value={formData.barcode}
                                onChange={onChange}
                                placeholder="Auto-generated if empty"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Product Status */}
            <Card>
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Product Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Publish Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => onChange({ target: { name: "status", value } })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft (Not visible to customers)</SelectItem>
                                    <SelectItem value="published">Published (Live on store)</SelectItem>
                                    <SelectItem value="archived">Archived (Hidden)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2 pt-8">
                            <Switch
                                id="featured"
                                checked={formData.featured}
                                onCheckedChange={(checked) => onChange({ target: { name: "featured", value: checked } })}
                            />
                            <Label htmlFor="featured" className="cursor-pointer">
                                Mark as Featured Product
                            </Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Physical Details */}
            <Card>
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Physical Details (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                name="weight"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.weight}
                                onChange={onChange}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Dimensions (cm)</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    name="dimensionsLength"
                                    type="number"
                                    min="0"
                                    value={formData.dimensions?.length || ""}
                                    onChange={(e) => onChange({
                                        target: {
                                            name: "dimensions",
                                            value: { ...formData.dimensions, length: e.target.value }
                                        }
                                    })}
                                    placeholder="L"
                                />
                                <Input
                                    name="dimensionsWidth"
                                    type="number"
                                    min="0"
                                    value={formData.dimensions?.width || ""}
                                    onChange={(e) => onChange({
                                        target: {
                                            name: "dimensions",
                                            value: { ...formData.dimensions, width: e.target.value }
                                        }
                                    })}
                                    placeholder="W"
                                />
                                <Input
                                    name="dimensionsHeight"
                                    type="number"
                                    min="0"
                                    value={formData.dimensions?.height || ""}
                                    onChange={(e) => onChange({
                                        target: {
                                            name: "dimensions",
                                            value: { ...formData.dimensions, height: e.target.value }
                                        }
                                    })}
                                    placeholder="H"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
