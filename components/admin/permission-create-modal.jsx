"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Shield, Loader2 } from "lucide-react"
import { createPermission, updatePermission } from "@/services/permission.service"

const CATEGORIES = [
  "Dashboard",
  "Products",
  "Orders",
  "Users",
  "Inventory",
  "POS",
  "Reports",
  "Settings",
  "System",
  "Content",
]

export function PermissionCreateModal({ open, onOpenChange, permission, onSuccess }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    category: "Dashboard",
  })

  const isEditMode = !!permission

  useEffect(() => {
    if (open) {
      if (permission) {
        setFormData({
          name: permission.name || "",
          displayName: permission.displayName || "",
          description: permission.description || "",
          category: permission.category || "Dashboard",
        })
      } else {
        setFormData({
          name: "",
          displayName: "",
          description: "",
          category: "Dashboard",
        })
      }
    }
  }, [open, permission])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-generate name from displayName
    if (name === "displayName" && !isEditMode) {
      const generatedName = value.toLowerCase().replace(/\s+/g, "_")
      setFormData((prev) => ({
        ...prev,
        name: generatedName,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.displayName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a permission name",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      if (isEditMode) {
        await updatePermission(permission._id, formData)
        toast({
          title: "Success",
          description: "Permission updated successfully",
        })
      } else {
        await createPermission(formData)
        toast({
          title: "Success",
          description: "Permission created successfully",
        })
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving permission:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save permission",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {isEditMode ? "Edit Permission" : "Create New Permission"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the permission details" : "Create a new permission that can be assigned to roles"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Permission Name *</Label>
            <Input
              id="displayName"
              name="displayName"
              placeholder="e.g., View Products"
              value={formData.displayName}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="name">
                System Name * <span className="text-xs text-muted-foreground">(auto-generated)</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="view_products"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what this permission allows..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
