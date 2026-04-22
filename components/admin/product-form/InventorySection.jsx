"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Package } from "lucide-react"

export default function InventorySection({ formData, setFormData, handleChange }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> 
            Identity & Identifier
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stock hidden for now as per user request */}
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                disabled={formData.hasVariations}
                className={formData.hasVariations ? "bg-muted" : "bg-background"}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="sku">Base SKU / Product Code</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. EF-PRO-001"
                className="bg-background"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Weight & Dimensions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label>Dimensions (L × W × H) cm</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  name="dimensions.length"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.dimensions?.length || ""}
                  onChange={handleChange}
                  placeholder="L"
                />
                <Input
                  name="dimensions.width"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.dimensions?.width || ""}
                  onChange={handleChange}
                  placeholder="W"
                />
                <Input
                  name="dimensions.height"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.dimensions?.height || ""}
                  onChange={handleChange}
                  placeholder="H"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-border bg-muted/20 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-primary">Shipping Configuration</h3>
            <p className="text-sm text-muted-foreground">Set delivery charges for different regions</p>
          </div>
          <div className="flex items-center space-x-3 bg-card p-2 px-4 rounded-full border border-border shadow-md dark:bg-zinc-800">
            <Switch
              id="shipping-free"
              checked={formData.shipping?.free || false}
              onCheckedChange={(checked) => setFormData(prev => ({ 
                ...prev, 
                shipping: { ...prev.shipping, free: checked } 
              }))}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="shipping-free" className="font-bold text-sm cursor-pointer select-none">Free Shipping</Label>
          </div>
        </div>

        {!formData.shipping?.free && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
              <Label htmlFor="shipping-insideDhakaCharge" className="text-muted-foreground text-[10px] mb-1 block uppercase font-bold tracking-wider">Inside Dhaka Charge (৳)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">৳</span>
                <Input
                  id="shipping-insideDhakaCharge"
                  name="shipping.insideDhakaCharge"
                  type="number"
                  min="0"
                  value={formData.shipping?.insideDhakaCharge || ""}
                  onChange={handleChange}
                  placeholder="70"
                  className="pl-8 text-xl font-black bg-transparent border-none focus-visible:ring-0 h-10"
                />
              </div>
            </div>
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
              <Label htmlFor="shipping-outsideDhakaCharge" className="text-muted-foreground text-[10px] mb-1 block uppercase font-bold tracking-wider">Outside Dhaka Charge (৳)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">৳</span>
                <Input
                  id="shipping-outsideDhakaCharge"
                  name="shipping.outsideDhakaCharge"
                  type="number"
                  min="0"
                  value={formData.shipping?.outsideDhakaCharge || ""}
                  onChange={handleChange}
                  placeholder="120"
                  className="pl-8 text-xl font-black bg-transparent border-none focus-visible:ring-0 h-10"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
