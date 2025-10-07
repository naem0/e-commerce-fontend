"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Shield, Loader2 } from "lucide-react"
import { getPermissions } from "@/services/permission.service"
import { createRole, updateRole } from "@/services/role.service"

const COLORS = [
  { name: "Purple", value: "#9333EA" },
  { name: "Red", value: "#DC2626" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#16A34A" },
  { name: "Yellow", value: "#CA8A04" },
  { name: "Gray", value: "#6B7280" },
  { name: "Pink", value: "#DB2777" },
  { name: "Indigo", value: "#4F46E5" },
  { name: "Orange", value: "#EA580C" },
  { name: "Teal", value: "#0D9488" },
]

export function RoleCreateModal({ open, onOpenChange, role, onSuccess }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [permissionsLoading, setPermissionsLoading] = useState(true)
  const [allPermissions, setAllPermissions] = useState({})
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    permissions: [],
    color: "#2563EB",
    priority: 50,
  })

  const isEditMode = !!role

  useEffect(() => {
    if (open) {
      fetchPermissions()
      if (role) {
        setFormData({
          name: role.name || "",
          displayName: role.displayName || "",
          description: role.description || "",
          permissions: role.permissions || [],
          color: role.color || "#2563EB",
          priority: role.priority || 50,
        })
      } else {
        setFormData({
          name: "",
          displayName: "",
          description: "",
          permissions: [],
          color: "#2563EB",
          priority: 50,
        })
      }
    }
  }, [open, role])

  const fetchPermissions = async () => {
    try {
      setPermissionsLoading(true)
      const response = await getPermissions()
      setAllPermissions(response.groupedPermissions || {})
    } catch (error) {
      console.error("Error fetching permissions:", error)
      toast({
        title: "Error",
        description: "Failed to load permissions",
        variant: "destructive",
      })
    } finally {
      setPermissionsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-generate name from displayName
    if (name === "displayName" && !isEditMode) {
      const generatedName = value.toUpperCase().replace(/\s+/g, "_")
      setFormData((prev) => ({
        ...prev,
        name: generatedName,
      }))
    }
  }

  const handlePermissionToggle = (permissionName) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionName)
        ? prev.permissions.filter((p) => p !== permissionName)
        : [...prev.permissions, permissionName],
    }))
  }

  const handleCategoryToggle = (categoryPermissions) => {
    const allSelected = categoryPermissions.every((p) => formData.permissions.includes(p.name))

    if (allSelected) {
      // Deselect all
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((p) => !categoryPermissions.find((cp) => cp.name === p)),
      }))
    } else {
      // Select all
      const newPermissions = categoryPermissions.map((p) => p.name)
      setFormData((prev) => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...newPermissions])],
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.displayName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a role name",
        variant: "destructive",
      })
      return
    }

    if (formData.permissions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one permission",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      if (isEditMode) {
        await updateRole(role._id, formData)
        toast({
          title: "Success",
          description: "Role updated successfully",
        })
      } else {
        await createRole(formData)
        toast({
          title: "Success",
          description: "Role created successfully",
        })
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving role:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save role",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {isEditMode ? "Edit Role" : "Create New Role"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the role details and permissions" : "Create a new role with specific permissions"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
            {/* Left: Role Details */}
            <div className="lg:col-span-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Role Name *</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  placeholder="e.g., Store Manager"
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
                    placeholder="STORE_MANAGER"
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
                  placeholder="Describe what this role can do..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Role Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color.value ? "border-black scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority (0-100)</Label>
                <Input
                  id="priority"
                  name="priority"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.priority}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">Higher priority roles appear first</p>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <Label>Preview</Label>
                  <Badge style={{ backgroundColor: formData.color }}>{formData.displayName || "Role Name"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{formData.permissions.length} permissions selected</p>
              </div>
            </div>

            {/* Right: Permissions */}
            <div className="lg:col-span-2 flex flex-col overflow-hidden">
              <div className="mb-4">
                <Label>Permissions *</Label>
                <p className="text-sm text-muted-foreground">Select permissions for this role</p>
              </div>

              {permissionsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {Object.entries(allPermissions).map(([category, permissions]) => {
                      const categoryPermissions = permissions
                      const allSelected = categoryPermissions.every((p) => formData.permissions.includes(p.name))
                      const someSelected = categoryPermissions.some((p) => formData.permissions.includes(p.name))

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{category}</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleCategoryToggle(categoryPermissions)}
                            >
                              {allSelected ? "Deselect All" : "Select All"}
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                            {categoryPermissions.map((permission) => (
                              <div key={permission._id} className="flex items-start space-x-2">
                                <Checkbox
                                  id={permission._id}
                                  checked={formData.permissions.includes(permission.name)}
                                  onCheckedChange={() => handlePermissionToggle(permission.name)}
                                />
                                <div className="flex-1">
                                  <Label
                                    htmlFor={permission._id}
                                    className="text-sm font-normal cursor-pointer leading-tight"
                                  >
                                    {permission.displayName}
                                  </Label>
                                  {permission.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5">{permission.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <Separator />
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || permissionsLoading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
